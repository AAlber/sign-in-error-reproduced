import { getAuth } from "@clerk/nextjs/server";
import type { NextApiRequest, NextApiResponse } from "next";
import {
  enrichAppointmentsWithOrganizerData,
  getAppointment,
  getLayerIdsOfAppointment,
  handleEmailNotificationForAppointment,
  updateAppointment,
  updateAppointmentSeries,
} from "@/src/server/functions/server-appointment";
import { getCurrentInstitutionId } from "@/src/server/functions/server-user";
import type {
  ScheduleAppointment,
  UpdateAppointmentData,
  UpdateAppointmentSeriesData,
} from "@/src/types/appointment.types";
import { log } from "@/src/utils/logger/logger";
import { hasRolesInAtLeastOneLayer } from "../../../server/functions/server-role";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    if (req.method === "POST") {
      const data = JSON.parse(req.body) as UpdateAppointmentData;
      const { userId } = getAuth(req);
      if (!userId) return res.status(401).json({ message: "Unauthorized" });

      const institutionId = await getCurrentInstitutionId(userId!);
      if (!institutionId)
        return res.status(400).json({ message: "No institution id found" });

      const appointment = await getAppointment(data.id);
      if (!appointment)
        return res.status(404).json({ message: "Appointment not found" });

      const layerIds = await getLayerIdsOfAppointment(data.id);
      if (!layerIds)
        return res.status(404).json({ message: "Layers not found" });

      const appointmentOnlyHasUserOrUserGroupAttendees =
        (appointment.appointmentUsers.length > 0 ||
          appointment.appointmentUserGroups.length > 0) &&
        appointment.appointmentLayers.length === 0;

      const appointmentHasCreator = !!appointment.appointmentCreator;
      const isCreator = appointment.appointmentCreator?.userId === userId;
      const isOrganizer = appointment.organizerUsers.some(
        (u) => u.organizerId === userId,
      );

      const isCreatorOrOrganizer = isCreator || isOrganizer;

      // If appointment only has "user or user group attendees"
      // then only organizer (no matter the role) and creator
      // of the appointment can update
      if (appointmentOnlyHasUserOrUserGroupAttendees && !isCreatorOrOrganizer) {
        return res.status(401).json({ message: "No access" });
      }

      const hasAccess = await hasRolesInAtLeastOneLayer({
        userId: userId!,
        layerIds: layerIds,
        rolesWithAccess: ["admin", "moderator", "educator"],
      });

      //Otherwise, (if appointment has "layer attendees")
      //then allow whoever has higher role in the layer(s)
      //and also creator or organizer to update
      if (!isCreatorOrOrganizer && !hasAccess) {
        return res.status(401).json({ message: "No adccess" });
      }

      if (data.updateSeries) {
        const result: ScheduleAppointment[] = await updateAppointmentSeries(
          data as UpdateAppointmentSeriesData,
          appointment.appointmentCreator
            ? appointment.appointmentCreator.userId
            : userId,
          institutionId,
        );

        handleEmailNotificationForAppointment({
          appointment: { ...result[0]!, rRule: data.rRule },
          operation: {
            type: "update",
          },
        });

        const appointmentsWithOrganizerData =
          await enrichAppointmentsWithOrganizerData(result, institutionId);

        return res.json(appointmentsWithOrganizerData);
      } else {
        const result: ScheduleAppointment[] = await updateAppointment(
          data,
          institutionId,
          appointmentHasCreator,
        );
        handleEmailNotificationForAppointment({
          appointment: result[0]!,
          operation: {
            type: "update",
            eventOfSeriesDate: appointment.series
              ? appointment.dateTime
              : undefined,
          },
        });

        const appointmentsWithOrganizerData =
          await enrichAppointmentsWithOrganizerData(result, institutionId);

        return res.json(appointmentsWithOrganizerData);
      }
    }
  } catch (e) {
    log.error(e);
    const err = e as Error;
    res.status(400).json({ success: true, message: err.message });
  }
}
