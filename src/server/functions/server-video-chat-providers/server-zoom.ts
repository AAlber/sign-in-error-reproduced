import axios from "axios";
import jwt from "jsonwebtoken";
import {
  getInstitutionSettings,
  updatePartialInstitutionSettings,
} from "../server-institution-settings";

type ZoomS2STokenResponse = {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope: string;
};

export type ZoomGeneralAppTokenResponse = ZoomS2STokenResponse & {
  refresh_token: string;
};

export async function createZoomMeeting(
  meetingName: string,
  oauthToken: string,
  duration: number,
  timezone: string,
) {
  const data = {
    topic: meetingName,
    type: 2, // scheduled meeting
    duration,
    timezone,
  };
  const headers = {
    Authorization: `Bearer ${oauthToken}`,
    "Content-Type": "application/json",
  };
  try {
    const response = await axios.post(
      process.env.ZOOM_MEETING_API_URL || "",
      data,
      { headers },
    );
    return response.data;
  } catch (error) {
    console.error("Error creating meeting", error);
  }
}

export async function getZoomAccessToken(institutionId: string) {
  const { use_own_zoom_account } = await getInstitutionSettings(institutionId);

  if (use_own_zoom_account) {
    return getZoomGeneralAppAccessToken(institutionId);
  }

  return getZoomS2SAccessToken(institutionId);
}

async function getZoomGeneralAppAccessToken(institutionId: string) {
  const { zoom_general_app_access_token, zoom_general_app_refresh_token } =
    await getInstitutionSettings(institutionId);

  const validToken = isAccessTokenValid(zoom_general_app_access_token);
  if (validToken) {
    return zoom_general_app_access_token;
  }

  // This is an edge case, for example when the user has just unlinked a zoom account but
  // for some reason (maybe another person) is in the process of starting a meeting and stops here.
  // Causing the refresh & (access token) to not be found.
  if (!zoom_general_app_refresh_token) {
    return null;
  }

  const newToken = await refreshZoomGeneralAppAccessToken(
    zoom_general_app_refresh_token,
  );

  if (!newToken) {
    return null;
  }

  await updatePartialInstitutionSettings(institutionId, {
    zoom_general_app_access_token: newToken.access_token,
    // Best practice (also updates refresh token).
    // Read: https://developers.zoom.us/docs/integrations/oauth/#refreshing-an-access-token
    zoom_general_app_refresh_token: newToken.refresh_token,
  });
  return newToken.access_token;
}

async function refreshZoomGeneralAppAccessToken(refreshToken: string) {
  const zoomTokenEndpoint = process.env.ZOOM_TOKEN_API_URL || "";
  const basicAuth = Buffer.from(
    `${process.env.NEXT_PUBLIC_ZOOM_GENERAL_APP_CLIENT_ID}:${process.env.ZOOM_GENERAL_APP_CLIENT_SECRET}`,
  ).toString("base64"); // encoded base64 format

  const res = await axios.post<ZoomGeneralAppTokenResponse>(
    zoomTokenEndpoint,
    new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    }).toString(),
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${basicAuth}`,
      },
    },
  );

  if (!res.data) {
    console.log("ERROR", res);
    return null;
  }

  return res.data;
}

async function getZoomS2SAccessToken(institutionId: string) {
  const { zoom_s2s_access_token } = await getInstitutionSettings(institutionId);

  const validToken = isAccessTokenValid(zoom_s2s_access_token);
  if (validToken) {
    return zoom_s2s_access_token;
  }

  const newToken = await generateZoomS2SAccessToken();
  if (!newToken) {
    return null;
  }

  await updatePartialInstitutionSettings(institutionId, {
    zoom_s2s_access_token: newToken.access_token,
  });
  return newToken.access_token;
}

//Read docs here: https://developers.zoom.us/docs/internal-apps/s2s-oauth/#generate-access-token
async function generateZoomS2SAccessToken() {
  const zoomTokenEndpoint = process.env.ZOOM_TOKEN_API_URL || "";
  const accountId = process.env.ZOOM_S2S_ACCOUNT_ID || "";

  const basicAuth = Buffer.from(
    `${process.env.ZOOM_S2S_CLIENT_ID}:${process.env.ZOOM_S2S_CLIENT_SECRET}`,
  ).toString("base64"); // encoded base64 format

  const res = await axios.post<ZoomS2STokenResponse>(
    zoomTokenEndpoint,
    new URLSearchParams({
      grant_type: "account_credentials",
      account_id: accountId,
    }).toString(),
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${basicAuth}`,
      },
    },
  );

  if (!res.data) {
    console.log("ERROR", res);
    return null;
  }

  return res.data;
}

export async function generateZoomGeneralAppAccessToken(
  redirectUri: string,
  code: string,
) {
  const zoomTokenEndpoint = process.env.ZOOM_TOKEN_API_URL || "";
  const basicAuth = Buffer.from(
    `${process.env.NEXT_PUBLIC_ZOOM_GENERAL_APP_CLIENT_ID}:${process.env.ZOOM_GENERAL_APP_CLIENT_SECRET}`,
  ).toString("base64"); // encoded base64 format

  const res = await axios.post<ZoomGeneralAppTokenResponse>(
    zoomTokenEndpoint,
    new URLSearchParams({
      grant_type: "authorization_code",
      redirect_uri: redirectUri,
      code,
    }).toString(),
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${basicAuth}`,
      },
    },
  );

  if (!res.data) {
    console.log("ERROR", res);
    return null;
  }

  return res.data;
}

export async function getZoomEmail(token: string) {
  const zoomProfileEndpoint = process.env.ZOOM_USER_PROFILE_API_URL || "";

  const res = await axios.get(zoomProfileEndpoint, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.data) {
    console.log("ERROR", res);
    return null;
  }

  return res.data.email;
}

function isAccessTokenValid(token: string, bufferInSeconds = 180) {
  try {
    const decoded = jwt.decode(token);
    if (!decoded || typeof decoded === "string" || !decoded.exp) {
      return false; // Token is invalid or failed to decode
    }

    const currentUnixTimestamp = Math.floor(Date.now() / 1000);
    return decoded.exp >= currentUnixTimestamp + bufferInSeconds;
  } catch (error) {
    return false;
  }
}

export async function updateZoomDetailsInstitutionSettings(
  code: string,
  redirect_uri: string,
  institutionId: string,
) {
  const zoomAccessTokenRes = await generateZoomGeneralAppAccessToken(
    redirect_uri,
    code,
  );

  if (!zoomAccessTokenRes) {
    return false;
  }

  const zoomAccountEmail = await getZoomEmail(zoomAccessTokenRes.access_token);

  await updatePartialInstitutionSettings(institutionId, {
    use_own_zoom_account: true,
    zoom_general_app_access_token: zoomAccessTokenRes.access_token,
    zoom_general_app_refresh_token: zoomAccessTokenRes.refresh_token,
    zoom_general_app_connected_email: zoomAccountEmail,
  });

  return true;
}
