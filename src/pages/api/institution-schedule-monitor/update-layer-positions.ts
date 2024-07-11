import { getAuth } from "@clerk/nextjs/server";
import type { NextApiRequest, NextApiResponse } from "next";
import { isValidCuid } from "@/src/server/functions/server-input";
import { updateLayerPositionsOnMonitor } from "@/src/server/functions/server-schedule-monitor";
import { getCurrentInstitutionId } from "@/src/server/functions/server-user";
import { isAdmin } from "../../../server/functions/server-role";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "POST") {
    const { layers } = JSON.parse(req.body) as {
      layers: { id: string; position: number }[];
    };
    const { userId } = getAuth(req);

    if (!layers) {
      res.status(400).json({ message: "Invalid data" });
      return;
    }

    layers.forEach((layer) => {
      if (!isValidCuid(layer.id))
        return res.status(400).json({ message: "Invalid layer id" });
    });

    const institutionId = await getCurrentInstitutionId(userId!);
    if (!institutionId) {
      res.status(404).json({ message: "Current institution not found" });
      return;
    }

    if (!(await isAdmin({ userId: userId!, institutionId: institutionId })))
      return res.status(401).json({ message: "Unauthorized" });

    const request = await updateLayerPositionsOnMonitor(institutionId, layers);
    return res.json(request);
  }
}
