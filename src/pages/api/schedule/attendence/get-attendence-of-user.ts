import { getAuth } from "@clerk/nextjs/server";
import type { NextApiRequest, NextApiResponse } from "next";
import { getLayerIdsOfAppointment } from "@/src/server/functions/server-appointment";
import { getAppointmentAttendenceLog } from "@/src/server/functions/server-appointment-attendence";
import { hasRolesInAtLeastOneLayer } from "@/src/server/functions/server-role";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "GET") {
    const { userId } = getAuth(req);
    const { targetUserId, appointmentId } = req.query as {
      targetUserId: string;
      appointmentId: string;
    };

    if (!appointmentId) {
      res.status(400).json({ message: "Invalid data" });
      return;
    }

    if (!targetUserId) {
      // Get own attendence log
      const attendenceLog = await getAppointmentAttendenceLog(
        userId!,
        appointmentId,
      );
      return res.json(attendenceLog);
    }

    const layerIds = await getLayerIdsOfAppointment(appointmentId);

    if (!layerIds) return res.status(404).json({ message: "Layers not found" });

    const hasAccess = await hasRolesInAtLeastOneLayer({
      userId: userId!,
      layerIds: layerIds,
      rolesWithAccess: ["admin", "moderator", "educator"],
    });

    if (!hasAccess) return res.status(401).json({ message: "No access" });

    const attendenceLog = await getAppointmentAttendenceLog(
      targetUserId,
      appointmentId,
    );
    return res.json(attendenceLog);
  }
}
