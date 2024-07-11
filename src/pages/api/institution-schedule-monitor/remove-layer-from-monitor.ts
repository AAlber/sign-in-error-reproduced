import { getAuth } from "@clerk/nextjs/server";
import type { NextApiRequest, NextApiResponse } from "next";
import { isValidCuid } from "@/src/server/functions/server-input";
import { removeLayerFromMonitor } from "@/src/server/functions/server-schedule-monitor";
import { getCurrentInstitutionId } from "@/src/server/functions/server-user";
import { isAdmin } from "../../../server/functions/server-role";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "POST") {
    const data = JSON.parse(req.body);
    const { userId } = getAuth(req);

    console.log(data);

    if (!data.layerId) {
      res.status(400).json({ message: "Invalid data" });
      return;
    }

    if (!isValidCuid(data.layerId))
      return res.status(400).json({ message: "Invalid layer id" });

    const institutionId = await getCurrentInstitutionId(userId!);
    if (!institutionId) {
      res.status(404).json({ message: "Current institution not found" });
      return;
    }

    if (!(await isAdmin({ userId: userId!, institutionId: institutionId })))
      return res.status(401).json({ message: "Unauthorized" });

    const request = await removeLayerFromMonitor(data.layerId, institutionId);
    return res.json(request);
  }
}
