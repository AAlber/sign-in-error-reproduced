import type {
  AppointmentAttendanceKeyValidityEnum,
  AppointmentAttendenceKey,
  User,
} from "@prisma/client";
import { toast } from "../components/reusable/toaster/toast";
import api from "../pages/api/api";
import type { AppointmentAttendanceUserLog } from "../pages/api/schedule/attendence/get-attendance-logs-of-user";
import type { AttendanceCheckInResponse } from "../types/appointment.types";
import { log } from "../utils/logger/logger";

export type MemberWithAttendence = User & {
  attended: boolean;
  attendingType: string;
  firstAttendedAt: Date | null;
};

export async function checkInWithRotatingQr(token: string) {
  const response = await fetch(api.checkInAttendenceWithRotatingQr, {
    method: "POST",
    body: JSON.stringify({
      token,
    }),
  });

  if (!response.ok && response.status.toString().startsWith("5")) {
    return {
      success: false,
      error: "checkin-unknown-error",
    };
  }

  return (await response.json()) as AttendanceCheckInResponse;
}

export async function checkInAttendence(
  appointmentId: string,
  key: string,
): Promise<AttendanceCheckInResponse> {
  const response = await fetch(api.checkInAttendence, {
    method: "POST",
    body: JSON.stringify({
      appointmentId,
      key,
    }),
  });

  if (!response.ok && response.status.toString().startsWith("5")) {
    return {
      success: false,
      error: "checkin-unknown-error",
    };
  }

  return (await response.json()) as AttendanceCheckInResponse;
}

export async function checkInOnlineAttendence(
  appointmentId: string,
): Promise<boolean> {
  const response = await fetch(api.checkInOnlineAttendence, {
    method: "POST",
    body: JSON.stringify({ appointmentId }),
  });

  if (!response.ok) return false;
  return true;
}

export async function getAttendenceKey(
  appointmentId: string,
): Promise<AppointmentAttendenceKey | null> {
  const response = await fetch(
    `${api.getAttendenceKey}?appointmentId=${appointmentId}`,
    { method: "GET" },
  );

  if (!response.ok) {
    toast.responseError({
      response,
      title: "toast_client_attendence.get_attendence_key",
    });
    return null;
  }
  return await response.json();
}

export async function updateAttendenceKeyValidity(
  appointmentId: string,
  validity: AppointmentAttendanceKeyValidityEnum,
): Promise<boolean> {
  const response = await fetch(`${api.updateAttendanceKeyValidity}`, {
    method: "POST",
    body: JSON.stringify({ appointmentId, validity }),
  });

  if (!response.ok) {
    toast.responseError({
      response,
      title: "toast_client_attendence.get_attendence_key",
    });
    return false;
  }
  return true;
}

export async function getAttendenceOfUser(
  targetUserId: string,
  appointmentId: string,
) {
  const response = await fetch(
    `${api.getAttendenceOfUser}?targetUserId=${targetUserId}&appointmentId=${appointmentId}`,
    { method: "GET" },
  );

  if (!response.ok) {
    return toast.responseError({
      response,
      title: "toast_client_attendence.get_attendence_of_user",
    });
  }
  return await response.json();
}

export async function getAttendenceOfUsers(
  userIds: string[],
  appointmentId: string,
) {
  const response = await fetch(
    `${api.getAttendenceOfUsers}?userIds=${userIds.join(
      ",",
    )}&appointmentId=${appointmentId}`,
    { method: "GET" },
  );

  if (!response.ok) {
    return toast.responseError({
      response,
      title: "toast_client_attendence.get_attendence_of_users",
    });
  }
  return await response.json();
}

export async function getAllAttendenceLogsFromAppointment(
  appointmentId: string,
): Promise<MemberWithAttendence[]> {
  const response = await fetch(
    `${api.getAllAttendenceLogsOfAppointment}?appointmentId=${appointmentId}`,
    { method: "GET" },
  );

  if (!response.ok) {
    toast.responseError({
      response,
      title: "toast_client_attendence.get_attendence_of_users",
    });
    return [];
  }
  return await response.json();
}

export async function updateAttendenceOfUser(
  appointmentId: string,
  targetUserId: string,
  attended: boolean,
  attendingType?: string,
) {
  const response = await fetch(api.updateAttendenceOfUser, {
    method: "PUT",
    body: JSON.stringify({
      appointmentId,
      targetUserId,
      attended,
      attendingType,
    }),
  });

  if (!response.ok) {
    return toast.responseError({
      response,
      title: "toast_client_attendence.update_attendence_of_user",
    });
  }
  return await response.json();
}

export async function updateAttendenceOfUsers(
  appointmentId: string,
  targetUserIds: string[],
  attended: boolean,
  attendingTypes: string[],
) {
  const response = await fetch(api.updateAttendenceOfUsers, {
    method: "PUT",
    body: JSON.stringify({
      appointmentId,
      targetUserIds,
      attended,
      attendingTypes,
    }),
  });

  if (!response.ok) {
    return toast.responseError({
      response,
      title: "toast_client_attendence.update_attendence_of_user",
    });
  }
  return await response.json();
}

export async function updateAttendenceOfUsersWithFullData(
  appointmentId: string,
  data: MemberWithAttendence[],
) {
  log.info("Updating attendence of users");
  const response = await fetch(api.updateAttendenceOfUsersWithFullData, {
    method: "PUT",
    body: JSON.stringify({
      appointmentId,
      data,
    }),
  });

  if (!response.ok) {
    log.error(response, "Error updating attendence of users");
    return toast.responseError({
      response,
      title: "toast_client_attendence.update_attendence_of_user",
    });
  }
  return await response.json();
}

export function getAttendanceLogsOfUser(
  userId?: string,
): Promise<AppointmentAttendanceUserLog[]> {
  const searchParam = userId ? `?targetUserId=${userId}` : "";
  return fetch(`${api.getAttendanceLogsOfUser}${searchParam}`, {
    method: "GET",
  }).then((response) => {
    if (!response.ok) {
      toast.responseError({ response });
      return [];
    }
    return response.json();
  });
}
