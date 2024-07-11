import { getAuth } from "@clerk/nextjs/server";
import type { NextApiRequest, NextApiResponse } from "next";
import { getLayerIdsOfAppointment } from "@/src/server/functions/server-appointment";
import {
  getAppointmentAttendenceKey,
  isAppointmentCreatorOrOrganizer,
} from "@/src/server/functions/server-appointment-attendence";
import { hasRolesInAtLeastOneLayer } from "@/src/server/functions/server-role";
import { respondToPreflightRequest } from "@/src/utils/utils";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "OPTIONS") return respondToPreflightRequest(req, res);
  if (req.method === "GET") {
    const { userId } = getAuth(req);
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const { appointmentId } = req.query as { appointmentId: string };

    if (!appointmentId) {
      res.status(400).json({ message: "Invalid data" });
      return;
    }

    const layerIds = await getLayerIdsOfAppointment(appointmentId);

    if (!layerIds) return res.status(404).json({ message: "Layers not found" });

    const hasAccess = await hasRolesInAtLeastOneLayer({
      userId: userId!,
      layerIds: layerIds,
      rolesWithAccess: ["admin", "moderator", "educator"],
    });

    const userIsCreatorOrOrganizer = await isAppointmentCreatorOrOrganizer(
      appointmentId,
      userId,
    );

    if (!hasAccess && !userIsCreatorOrOrganizer)
      return res.status(401).json({ message: "No access" });

    const attendenceKey = await getAppointmentAttendenceKey(appointmentId);
    return res.json(attendenceKey);
  }
}
