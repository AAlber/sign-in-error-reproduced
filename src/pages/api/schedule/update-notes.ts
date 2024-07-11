import { getAuth } from "@clerk/nextjs/server";
import type { NextApiRequest, NextApiResponse } from "next";
import {
  getAppointment,
  getLayerIdsOfAppointment,
  updateAppointmentNotes,
} from "@/src/server/functions/server-appointment";
import { hasRolesInAtLeastOneLayer } from "@/src/server/functions/server-role";
import cacheHandler from "@/src/utils/cache-handler/cache-redis-handler";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "POST") {
    const { userId } = getAuth(req);
    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    const data = JSON.parse(req.body);

    const appointment = await getAppointment(data.id);
    if (!appointment)
      return res.status(404).json({ message: "Appointment not found" });

    const [result, layerIds] = await Promise.all([
      updateAppointmentNotes(data.id, data.notes),
      getLayerIdsOfAppointment(data.id),
    ]);

    const appointmentOnlyHasUserOrUserGroupAttendees =
      (appointment.appointmentUsers.length > 0 ||
        appointment.appointmentUserGroups.length > 0) &&
      appointment.appointmentLayers.length === 0;

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

    await cacheHandler.invalidate.many(
      "course-upcoming-appointments",
      layerIds,
    );
    return res.json(result);
  } else {
    return res.status(405).json({ message: "Method not allowed" });
  }
}
