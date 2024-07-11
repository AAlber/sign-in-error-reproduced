import { getAuth } from "@clerk/nextjs/server";
import type { NextApiRequest, NextApiResponse } from "next";
import { getLayerIdsOfAppointment } from "@/src/server/functions/server-appointment";
import { updateAppointmentAttendenceLog } from "@/src/server/functions/server-appointment-attendence";
import { hasRolesInAtLeastOneLayer } from "@/src/server/functions/server-role";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "PUT") {
    const data = JSON.parse(req.body) as {
      appointmentId: string;
      targetUserId: string;
      attended: boolean;
      attendingType: string;
    };

    if (
      !data.appointmentId ||
      !data.targetUserId ||
      data.attended === undefined
    ) {
      res.status(400).json({ message: "Invalid data" });
      return;
    }

    const { userId } = getAuth(req);

    const layerIds = await getLayerIdsOfAppointment(data.appointmentId);

    if (!layerIds) return res.status(404).json({ message: "Layers not found" });

    const hasAccess = await hasRolesInAtLeastOneLayer({
      userId: userId!,
      layerIds: layerIds,
      rolesWithAccess: ["admin", "moderator", "educator"],
    });

    if (!hasAccess) return res.status(401).json({ message: "No access" });

    await updateAppointmentAttendenceLog(
      data.targetUserId,
      data.appointmentId,
      data.attended,
      data.attendingType === "online",
    );
    return res.json({ message: "Updated attendence of user" });
  }
}
