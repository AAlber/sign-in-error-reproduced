import { getAuth } from "@clerk/nextjs/server";
import type { NextApiRequest, NextApiResponse } from "next";
import { getLayersToMonitor } from "@/src/server/functions/server-schedule-monitor";
import { getCurrentInstitutionId } from "@/src/server/functions/server-user";
import { isMemberOfInstitution } from "../../../server/functions/server-role";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "GET") {
    const { userId } = getAuth(req);

    const institutionId = await getCurrentInstitutionId(userId!);
    if (!institutionId) {
      res.status(404).json({ message: "Current institution not found" });
      return;
    }

    if (
      !(await isMemberOfInstitution({
        userId: userId!,
        institutionId: institutionId,
      }))
    )
      return res.status(401).json({ message: "Unauthorized" });

    const request = await getLayersToMonitor(institutionId);

    return res.json(request);
  }
}
