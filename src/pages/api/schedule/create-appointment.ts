import { getAuth } from "@clerk/nextjs/server";
import type { NextApiRequest, NextApiResponse } from "next";
import {
  createAppointment,
  createAppointmentSeries,
  handleEmailNotificationForAppointment,
} from "@/src/server/functions/server-appointment";
import { getCurrentInstitutionId } from "@/src/server/functions/server-user";
import type {
  AppointmentDataTypeWithSeriesData,
  ScheduleAppointment,
} from "@/src/types/appointment.types";
import {
  hasRolesInAtLeastOneLayer,
  hasRolesInInstitution,
} from "../../../server/functions/server-role";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "POST") {
    const data = JSON.parse(req.body) as AppointmentDataTypeWithSeriesData;
    const { userId } = getAuth(req);
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const institutionId = await getCurrentInstitutionId(userId);
    if (!institutionId) return res.status(404).json("Institution not found");

    const appointmentHasCourseAsAttendee = data.layerIds.length > 0;
    if (appointmentHasCourseAsAttendee) {
      const hasAccess = await hasRolesInAtLeastOneLayer({
        userId,
        layerIds: data.layerIds,
        rolesWithAccess: ["admin", "moderator", "educator"],
      });

      if (!hasAccess) return res.status(401).json({ message: "No access" });
    }

    if (!appointmentHasCourseAsAttendee) {
      const hasAccess = await hasRolesInInstitution(userId, institutionId, [
        "admin",
        "moderator",
        "educator",
      ]);

      if (!hasAccess) return res.status(401).json({ message: "No access" });
    }

    if (data.isSeries) {
      if (!data.rRule)
        return res.status(400).json({ message: "Invalid rrule" });
      const result: ScheduleAppointment[] = await createAppointmentSeries(
        {
          ...data,
          rRule: data.rRule,
        },
        userId!,
        institutionId,
      );

      handleEmailNotificationForAppointment({
        appointment: {
          ...result[0]!,
          rRule: data.rRule,
        },
        operation: { type: "create" },
      });

      return res.json(result);
    } else {
      const result: ScheduleAppointment[] = await createAppointment(
        data,
        userId!,
        institutionId,
      );

      handleEmailNotificationForAppointment({
        appointment: result[0]!,
        operation: { type: "create" },
      });
      return res.json(result);
    }
  }
}
