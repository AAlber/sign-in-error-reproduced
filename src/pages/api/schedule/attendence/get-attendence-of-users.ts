import { getAuth } from "@clerk/nextjs/server";
import type { NextApiRequest, NextApiResponse } from "next";
import { getLayerIdsOfAppointment } from "@/src/server/functions/server-appointment";
import { getAppointmentAttendeneLogsOfUsers } from "@/src/server/functions/server-appointment-attendence";
import { hasRolesInAtLeastOneLayer } from "@/src/server/functions/server-role";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "GET") {
    const { userId } = getAuth(req);
    const { userIds, appointmentId } = req.query as {
      userIds: string[];
      appointmentId: string;
    };

    if (!Array.isArray(userIds) || !appointmentId) {
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

    if (!hasAccess) return res.status(401).json({ message: "No access" });

    const attendenceLogs = await getAppointmentAttendeneLogsOfUsers(
      userIds,
      appointmentId,
    );
    return res.json(attendenceLogs);
  }
}
