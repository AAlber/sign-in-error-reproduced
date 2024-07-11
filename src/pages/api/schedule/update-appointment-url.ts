import { getAuth } from "@clerk/nextjs/server";
import type { NextApiRequest, NextApiResponse } from "next";
import {
  getAppointment,
  getLayerIdsOfAppointment,
} from "@/src/server/functions/server-appointment";
import { prisma } from "../../../server/db/client";
import { hasRolesInAtLeastOneLayer } from "../../../server/functions/server-role";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "POST") {
    const data = JSON.parse(req.body) as { id: string; url: string };
    const { userId } = getAuth(req);

    const appointment = await getAppointment(data.id);
    if (!appointment)
      return res.status(404).json({ message: "Appointment not found" });

    const layerIds = await getLayerIdsOfAppointment(data.id);
    if (!layerIds) return res.status(404).json({ message: "Layers not found" });

    const hasAccess = await hasRolesInAtLeastOneLayer({
      userId: userId!,
      layerIds: layerIds,
      rolesWithAccess: ["admin", "moderator", "educator"],
    });

    if (!hasAccess) return res.status(401).json({ message: "No access" });

    const request = await prisma.appointment.update({
      where: { id: data.id },
      data: { onlineAddress: data.url },
    });

    return res.json(request);
  }
}
