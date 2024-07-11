import { getAuth } from "@clerk/nextjs/server";
import type { NextApiRequest, NextApiResponse } from "next";
import { getAppointment } from "@/src/server/functions/server-appointment";
import {
  getAppointmentAttendenceKey,
  isAppointmentCreatorOrganizerorAttendee,
  updateAppointmentAttendenceLogWithFirstAttendedTimestamp,
} from "@/src/server/functions/server-appointment-attendence";
import { hasRolesWithAccess } from "@/src/server/functions/server-role";
import { getCurrentInstitutionId } from "@/src/server/functions/server-user";
import type { AttendanceCheckInResponse } from "@/src/types/appointment.types";
import cacheHandler from "@/src/utils/cache-handler/cache-redis-handler";
import { respondToPreflightRequest } from "@/src/utils/utils";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "OPTIONS") return respondToPreflightRequest(req, res);
  if (req.method === "POST") {
    const data = JSON.parse(req.body) as {
      appointmentId: string;
      key: string;
    };

    if (!data.appointmentId || !data.key) {
      return res.status(400).json({ message: "Invalid data" });
    }

    const { userId } = getAuth(req);
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const institutionId = await getCurrentInstitutionId(userId);
    if (!institutionId)
      return res.status(400).json({ message: "No institution id found" });

    const appointment = await getAppointment(data.appointmentId);
    if (!appointment)
      return res.status(404).json({ message: "Appointment not found" });

    const layerIds = appointment.appointmentLayers.map((al) => al.layer.id);
    const hasAccess = await hasRolesWithAccess({
      userId: userId!,
      layerIds: layerIds,
      rolesWithAccess: ["admin", "moderator", "educator", "member"],
    });

    const isUserCreatorOrOrganizerOrAttendee =
      await isAppointmentCreatorOrganizerorAttendee(
        data.appointmentId,
        userId,
        institutionId,
      );

    if (!hasAccess && !isUserCreatorOrOrganizerOrAttendee)
      return res.status(401).json({ message: "No access" });

    const today = new Date();
    const isSameDay =
      appointment.dateTime.getDay() === today.getDay() &&
      appointment.dateTime.getMonth() === today.getMonth() &&
      appointment.dateTime.getFullYear() === today.getFullYear();

    if (!isSameDay) {
      return res.status(200).json({
        success: false,
        error: "checkin-invalid-date",
      } satisfies AttendanceCheckInResponse);
    }

    const key = await getAppointmentAttendenceKey(appointment.id);
    if (data.key !== key.id) {
      return res.status(200).json({
        success: false,
        error: "checkin-invalid-key",
      } satisfies AttendanceCheckInResponse);
    }

    let isValid = false;
    let error: AttendanceCheckInResponse["error"] = "checkin-expired";

    const now = Date.now();
    const appointmentStart = appointment.dateTime.getTime();
    const appointmentEnd =
      appointment.dateTime.getTime() + appointment.duration * 60 * 1000;

    switch (key.validity) {
      case "EVENT_DURATION": {
        // during the event duration
        error = now < appointmentStart ? "checkin-too-early" : error;
        isValid = now > appointmentStart && now < appointmentEnd;
        break;
      }
      case "H1_BEFORE_AFTER": {
        const ONE_HOUR = 60 * 60 * 1000;
        const start = appointmentStart - ONE_HOUR;
        const end = appointmentEnd + ONE_HOUR;
        error = now < start ? "checkin-too-early" : error;
        isValid = now > start && now < end;
        break;
      }
      case "WHOLE_DAY": {
        // this point if reached should always be true since we already passed check above
        isValid = isSameDay;
        break;
      }
      case "ROTATING_QR": {
        // we'll use attendence rotating qr checkin api
      }
      default: {
        // its assumed that we never reach this case
        throw new Error("Something went wrong");
      }
    }

    if (!isValid) {
      const response: AttendanceCheckInResponse = {
        success: false,
        error,
      };
      return res.status(200).json(response);
    }

    // If the key is valid, then check-in the user to the appointment
    await updateAppointmentAttendenceLogWithFirstAttendedTimestamp(
      userId!,
      data.appointmentId,
      true,
      false,
    );

    await cacheHandler.invalidate.single(
      "user-courses-with-progress-data",
      userId!,
    );

    return res
      .status(200)
      .json({ success: true } satisfies AttendanceCheckInResponse);
  }
}
