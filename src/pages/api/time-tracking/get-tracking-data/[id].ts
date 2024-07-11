import { getAuth } from "@clerk/nextjs/server";
import type { NextApiRequest, NextApiResponse } from "next";
import { isAdmin } from "@/src/server/functions/server-role";
import { getTimeTrackingDataForUser } from "@/src/server/functions/server-time-tracking";
import { getCurrentInstitutionId } from "@/src/server/functions/server-user";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "GET") {
    const { id } = req.query as { id: string };
    const { userId } = getAuth(req);

    if (!userId) return res.status(404).json({ message: "User not found" });

    const currentInstitutionId = await getCurrentInstitutionId(userId!);
    if (!currentInstitutionId)
      return res.status(404).json({ message: "User institution not found" });

    if (!(await isAdmin({ userId, institutionId: currentInstitutionId })))
      return res.status(401).json({ message: "Unauthorized" });

    const timeTrackingData = await getTimeTrackingDataForUser(
      id,
      currentInstitutionId,
    );
    return res.status(200).json(timeTrackingData);
  }
}
