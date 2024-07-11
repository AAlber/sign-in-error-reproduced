import { getAuth } from "@clerk/nextjs/server";
import type { NextApiRequest, NextApiResponse } from "next";
import {
  deleteAppointment,
  deleteAppontmentSeries,
  getAppointment,
  getLayerIdsOfAppointment,
  handleEmailNotificationForAppointment,
} from "@/src/server/functions/server-appointment";
import { getCurrentInstitutionId } from "@/src/server/functions/server-user";
import cacheHandler from "@/src/utils/cache-handler/cache-redis-handler";
import {
  hasRolesInAtLeastOneLayer,
  hasRolesInInstitution,
} from "../../../server/functions/server-role";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "POST") {
    const data = JSON.parse(req.body);
    const { userId } = getAuth(req);
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const appointment = await getAppointment(data.id);
    if (!appointment)
      return res.status(404).json({ message: "Appointment not found" });

    const institutionId = await getCurrentInstitutionId(userId);
    if (!institutionId) return res.status(404).json("Institution not found");

    const layerIds = await getLayerIdsOfAppointment(data.id);
    if (!layerIds) return res.status(404).json({ message: "Layers not found" });

    const appointmentOnlyHasUserOrUserGroupAttendees =
      (appointment.appointmentUsers.length > 0 ||
        appointment.appointmentUserGroups.length > 0) &&
      appointment.appointmentLayers.length === 0;

    // If appointment only has "user / user group attendees"
    // then only organizer (with higher role in any layer in the organisation)
    // or creator of the appointment can delete
    if (appointmentOnlyHasUserOrUserGroupAttendees) {
      const hasAccess = await hasRolesInInstitution(userId, institutionId, [
        "admin",
        "moderator",
        "educator",
      ]);

      const isCreator = appointment.appointmentCreator?.userId === userId;
      const isOrganizer = appointment.organizerUsers.some(
        (u) => u.organizerId === userId,
      );

      const isHigherRoleOrganizer = isOrganizer && hasAccess;

      if (!isHigherRoleOrganizer && !isCreator)
        return res.status(401).json({ message: "No access" });
    } else {
      const hasAccess = await hasRolesInAtLeastOneLayer({
        userId,
        layerIds,
        rolesWithAccess: ["admin", "moderator", "educator"],
      });

      // If appointment contains "layer attendee(s)", then only
      // users with higher role in the layer(s) and the creator can delete
      if (!hasAccess) return res.status(401).json({ message: "No access" });
    }

    const deleteSeries = data.deleteSeries;

    if (data.notifyParticipants) {
      // TODO: Notify participants
    }

    if (deleteSeries) {
      if (!appointment.seriesId)
        return res.status(400).json({ message: "Invalid seriesId" });

      await handleEmailNotificationForAppointment({
        appointment: appointment,
        operation: {
          type: "delete",
        },
      });

      await deleteAppontmentSeries(appointment.seriesId);
      await cacheHandler.invalidate.many(
        "course-upcoming-appointments",
        layerIds,
      );
      await cacheHandler.invalidate.custom({
        prefix: "user-courses-with-progress-data",
        origin: "api/schedule/delete-appointment.ts (delete series)",
        type: "many",
        searchParam: layerIds,
      });
      return res.json({
        message: "Appointment deleted",
        seriesId: appointment.seriesId,
        series: { id: appointment.series?.id },
      });
    }

    await handleEmailNotificationForAppointment({
      appointment: appointment,
      operation: {
        type: "delete",
        eventOfSeriesDate: appointment.seriesId
          ? appointment.dateTime
          : undefined,
      },
    });

    await deleteAppointment(data.id);

    await cacheHandler.invalidate.many(
      "course-upcoming-appointments",
      layerIds,
    );
    await cacheHandler.invalidate.custom({
      prefix: "user-courses-with-progress-data",
      origin: "api/schedule/delete-appointment.ts (delete single)",
      type: "many",
      searchParam: layerIds,
    });
    return res.json({ message: "Appointment deleted", id: data.id });
  }
}
