import { useInstitutionSettings } from "@/src/components/institution-settings/zustand";
import useAppointmentEditor from "@/src/components/popups/appointment-editor/zustand";
import { toast } from "@/src/components/reusable/toaster/toast";
import api from "@/src/pages/api/api";
import { uploadInstitutionSettingsWithProcessToast } from "../client-institution-settings";

export async function handleZoomOAuth(state: string, code: string) {
  const redirectFromZoom = state === "zoomOAuthSuccess";
  if (redirectFromZoom && code && code.length > 0) {
    await getGeneralAppZoomAccessToken(code as string);
    window.location.assign("/");
  }
}

export async function generateZoomLink(
  layerIds: string[],
  title: string,
  duration: number,
) {
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const reponse = await fetch(api.createZoomMeeting, {
    method: "POST",
    body: JSON.stringify({
      layerIds,
      title,
      duration,
      timezone,
    }),
  });

  if (!reponse.ok) {
    if (reponse.status === 405) {
      toast.warning("toast.zoom_warning_title", {
        icon: "⚙️",
        description: "toast.zoom_warning_subtitle",
      });
      return null;
    }
    toast.error("toast.zoom_error", {
      description: "toast.zoom_error_desc",
    });
    return null;
  }

  const data: {
    start_url: string;
    join_url: string;
  } = await reponse.json();

  return { url: data.join_url, modUrl: data.start_url };
}

export async function getGeneralAppZoomAccessToken(authorizationCode: string) {
  const reponse = await fetch(api.getGeneralAppZoomAccessToken, {
    method: "POST",
    body: JSON.stringify({
      code: authorizationCode,
      redirect_uri: process.env.NEXT_PUBLIC_SERVER_URL || "",
    }),
  });

  if (!reponse.ok) {
    if (reponse.status === 405) {
      toast.warning("toast.zoom_warning_title", {
        icon: "⚙️",
        description: "toast.zoom_warning_subtitle",
      });
      return null;
    }
    return null;
  }
}

export const usesFuxamZoomAccount = () => {
  const { provider, isOnline, isHybrid } = useAppointmentEditor.getState();
  const { institutionSettings } = useInstitutionSettings.getState();
  return (
    !institutionSettings.use_own_zoom_account &&
    (isOnline || isHybrid) &&
    provider === "zoom"
  );
};

export const hasValidZoomMeetingLength = (duration: string) => {
  if (usesFuxamZoomAccount()) {
    if (Number(duration) > 30) {
      return false;
    }
  }
  return true;
};

export async function resetZoomDetailInstitutionSettings() {
  // unlinking by removing tokens and using S2S
  const { institutionSettings, updateInstitutionSettings } =
    useInstitutionSettings.getState();
  const reset = {
    use_own_zoom_account: false,
    zoom_general_app_refresh_token: "",
    zoom_general_app_access_token: "",
    zoom_general_app_connected_email: "",
  };

  await uploadInstitutionSettingsWithProcessToast({
    ...institutionSettings,
    ...reset,
  });
  updateInstitutionSettings(reset);
}

export function redirectToZoomOAuthScreen() {
  window.open(
    `https://zoom.us/oauth/authorize?client_id=${
      process.env.NEXT_PUBLIC_ZOOM_GENERAL_APP_CLIENT_ID
    }&response_type=code&redirect_uri=${encodeURIComponent(
      process.env.NEXT_PUBLIC_SERVER_URL || "",
    )}&state=zoomOAuthSuccess`,
  );
}
