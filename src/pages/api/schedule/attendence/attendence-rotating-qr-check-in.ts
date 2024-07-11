import { getAuth } from "@clerk/nextjs/server";
import type { NextApiRequest, NextApiResponse } from "next";
import { getAppointment } from "@/src/server/functions/server-appointment";
import {
  isAppointmentCreatorOrganizerorAttendee,
  updateAppointmentAttendenceLogWithFirstAttendedTimestamp,
} from "@/src/server/functions/server-appointment-attendence";
import { hasRolesWithAccess } from "@/src/server/functions/server-role";
import { getCurrentInstitutionId } from "@/src/server/functions/server-user";
import { sentry } from "@/src/server/singletons/sentry";
import type { AttendanceCheckInResponse } from "@/src/types/appointment.types";
import cacheHandler from "@/src/utils/cache-handler/cache-redis-handler";
import { respondToPreflightRequest } from "@/src/utils/utils";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "OPTIONS") return respondToPreflightRequest(req, res);
  const body = JSON.parse(req.body) as { token: string };
  const token = body?.token;

  if (!token) {
    sentry.captureMessage(`Missing token in request`);
    return res.status(400).json({
      success: false,
      error: "checkin-unknown-error",
    } satisfies AttendanceCheckInResponse);
  }

  const auth = getAuth(req);
  const userId = auth.userId!;
  if (!userId) return res.status(401).json({ message: "Unauthorized" });

  const institutionId = await getCurrentInstitutionId(userId);
  if (!institutionId)
    return res.status(400).json({ message: "No institution id found" });

  sentry.addBreadcrumb({ message: "Rotating QR checkIn init" });
  sentry.setUser({ id: userId });

  const appointmentId = await cacheHandler.get(
    "appointment-checkin-rotating-token",
    token,
  );
  if (!appointmentId) {
    return res.status(401).json({
      success: false,
      error: "checkin-expired",
    } satisfies AttendanceCheckInResponse);
  }

  const appointment = await getAppointment(appointmentId);
  const layerIds = appointment?.appointmentLayers.map((i) => i.layerId) || [];

  if (!layerIds.length) {
    sentry.captureMessage(`Missing layers for appointmentId: ${appointmentId}`);
    // return res.status(400).json({
    //   success: false,
    //   error: "checkin-unknown-error",
    // } satisfies AttendanceCheckInResponse);
  }
  const hasAccess = await hasRolesWithAccess({
    userId,
    layerIds,
    rolesWithAccess: ["admin", "moderator", "educator", "member"],
    needsAllRoles: true,
  });

  const isUserCreatorOrOrganizerOrAttendee =
    await isAppointmentCreatorOrganizerorAttendee(
      appointmentId,
      userId,
      institutionId,
    );

  if (!hasAccess && !isUserCreatorOrOrganizerOrAttendee) {
    return res.status(401).json({
      success: false,
      error: "checkin-unauthorized",
    } satisfies AttendanceCheckInResponse);
  }

  await updateAppointmentAttendenceLogWithFirstAttendedTimestamp(
    userId,
    appointmentId,
    true,
    false,
  );

  await cacheHandler.invalidate.single(
    "user-courses-with-progress-data",
    userId,
  );

  return res
    .status(200)
    .json({ success: true } satisfies AttendanceCheckInResponse);
}
