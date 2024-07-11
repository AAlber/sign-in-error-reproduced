import type { User } from "@prisma/client";
import * as Sentry from "@sentry/browser";
import type { NextRouter } from "next/router";
import { useEffect, useState } from "react";
import { useInstitutionSettings } from "../components/institution-settings/zustand";
import { toast } from "../components/reusable/toaster/toast";
import api from "../pages/api/api";
import type { UserGrade } from "../types/user.types";
import type { UserData } from "../types/user-data.types";
import { log } from "../utils/logger/logger";
import useUser from "../zustand/user";
import { getInstitutionSettings } from "./client-institution-settings";
import { handleZoomOAuth } from "./client-video-chat-providers/zoom";

export async function getUserData(userId: string): Promise<UserData> {
  return fetch(api.getUserData + "?userId=" + userId, {
    method: "GET",
  }).then(async (response) => {
    if (!response.ok) {
      if (![401, 307, 308].includes(response.status)) {
        Sentry.captureMessage(
          "getUserData Response error: " + response.status,
          { level: "error" },
        );
      }
    }
    try {
      const data = await response.json();
      if (data === typeof "string") {
        return JSON.parse(data);
      } else {
        return data;
      }
    } catch (error) {
      console.error(error);
      Sentry.captureException(error);
      return null;
    }
  });
}

export function updateUser(data: Partial<User>) {
  return fetch(api.updateUser, {
    method: "POST",
    body: JSON.stringify(data),
  }).then((response) => {
    if (!response.ok) {
      toast.responseError({
        response,
        title: "toast_user_update_error",
      });
    }
  });
}

export async function updateUserCurrentInstitution(
  id: string,
): Promise<UserData | null> {
  const response = await fetch(api.updateUserInstitution, {
    method: "POST",
    body: JSON.stringify({
      data: {
        id: id,
      },
    }),
  });
  if (!response.ok) {
    toast.responseError({
      response,
      title: "toast_user_organization_update_error",
    });
    return null;
  }
  const userData = await response.json();
  return userData;
}

export async function fetchInstitutions(): Promise<any[]> {
  const response = await fetch(api.getInstitutionsOfUser, {
    method: "GET",
  });
  if (!response.ok) {
    throw new Error(response.statusText);
  }

  const data = await response.json();
  return data;
}

export const getTotalUsers = async (countAccessPassUsers: boolean) => {
  const { currentInstitutionId: currentInstitution } = useUser.getState().user;
  const res = await fetch(
    api.countUsers +
      currentInstitution +
      `?countAccessPassUsers=${countAccessPassUsers}`,
    { method: "GET" },
  );
  const totalUsers = await res.json();
  return totalUsers;
};

type getUsersOfLayerArgs = {
  layerId: string;
  excludeUserIds?: string[];
  role?: Role;
  search?: string;
  take?: number;
  cursor?: string;
  excludeAuthenticatedUser?: boolean;
};

export async function getUsersOfLayer({
  layerId,
  role,
  search,
  take,
  cursor,
  excludeAuthenticatedUser = true,
}: getUsersOfLayerArgs) {
  const url = new URL(
    `${api.getUsersByLayerId}${layerId}`,
    window.location.origin,
  );

  if (role) url.searchParams.append("role", role);
  if (search) url.searchParams.append("search", search);
  if (take) url.searchParams.append("take", String(take));
  if (cursor) url.searchParams.append("cursor", cursor);

  url.searchParams.append(
    "excludeAuth",
    String(Number(excludeAuthenticatedUser)),
  );

  const path = `${url.pathname}${url.search}`;
  const result = await fetch(path);
  return (await result.json()) as User[];
}

export async function getUsersOfAllInstitutions(
  query: string,
  excludeUserIds?: string[],
) {
  const url = new URL(`${api.getUsersForChatCreation}`, window.location.origin);
  url.searchParams.append("search", query);

  if (excludeUserIds)
    url.searchParams.append("excludeUserIds", excludeUserIds.join(","));

  const result = await fetch(url);
  const data = (await result.json()) as User[];
  return data;
}

export async function getGradesOfSpecificUser(
  userId: string,
  layerId?: string,
): Promise<UserGrade[]> {
  let url = api.getSpecificUserGrades;
  const params = new URLSearchParams();

  params.append("userId", userId);
  if (layerId !== undefined) params.append("layerId", layerId);
  if (params.toString()) url += `?${params}`;

  const response = await fetch(url);
  if (!response.ok) {
    toast.responseError({
      response,
    });
    Sentry.captureMessage(
      "getGradesOfSpecificUser Response error: " + response.status,
      {
        level: "error",
      },
    );
  }
  const data = await response.json();
  return data;
}

export async function getUserGrades(layerId?: string): Promise<UserGrade[]> {
  const params = layerId ? `?layerId=${encodeURIComponent(layerId)}` : "";
  const url = `${api.getUserGrades}${params}`;

  const response = await fetch(url);
  if (!response.ok) {
    toast.responseError({
      response,
    });
    Sentry.captureMessage("getUserGrades Response error: " + response.status, {
      level: "error",
    });
  }

  return response.json();
}

export function useHandleOAuth(router: NextRouter) {
  const [loading, setLoading] = useState(false);
  const { setInstitutionSettings } = useInstitutionSettings.getState();
  const { state, code } = router.query;

  const handleOAuth = async () => {
    console.log("handleOAuth");
    setLoading(true);
    console.log("handleZoomOAuth");
    await handleZoomOAuth(state as string, code as string);
    console.log("getInstitutionSettings");
    const settings = await getInstitutionSettings();
    console.log("redirectBasedOnQueryParams");
    setLoading(false);
    console.log("setInstitutionSettings");
    setInstitutionSettings(settings);
  };

  useEffect(() => {
    handleOAuth();
  }, [router.isReady]);

  return { loading };
}

export async function getLayerIdsOfUser(isCourse = false) {
  log.info("client - getLayerIdsOfUser", { isCourse });
  const url = new URL(api.getLayerIdsOfUser, window.location.origin);
  if (isCourse) url.searchParams.append("isCourse", "true");

  const result = await fetch(url);

  if (!result.ok) {
    log.response(result);
    return [];
  }

  const data = (await result.json()) as string[];

  // https://github.com/FuxamEducation/fuxam-web/issues/1601
  return Array.isArray(data) ? data : [];
}
