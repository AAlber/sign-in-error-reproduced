import { getAuth } from "@clerk/nextjs/server";
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/src/server/db/client";
import { getLayerIdsOfAppointment } from "@/src/server/functions/server-appointment";
import { hasRolesInAtLeastOneLayer } from "@/src/server/functions/server-role";

/** @deprecated */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "POST") {
    const data = JSON.parse(req.body) as {
      appointmentId: string;
      expireAfterMinutes: number;
    };

    if (!data.appointmentId || !data.expireAfterMinutes) {
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

    const update = await prisma.appointmentAttendenceKey.update({
      where: {
        appointmentId: data.appointmentId,
      },
      data: {
        expireAfterMinutes: data.expireAfterMinutes,
      },
    });

    return res.json(update);
  }
}
