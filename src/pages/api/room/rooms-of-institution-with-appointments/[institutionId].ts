import { getAuth } from "@clerk/nextjs/server";
import type { NextApiRequest, NextApiResponse } from "next";
import { getInstitutionRoomsWithAppointments } from "@/src/server/functions/server-institution-room";
import { isValidCuid } from "../../../../server/functions/server-input";
import { isMemberOfInstitution } from "../../../../server/functions/server-role";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "GET") {
    const institutionId = req.query.institutionId as string;
    const { userId } = getAuth(req);

    if (!institutionId) {
      res.status(400).json({ message: "Invalid data" });
      return;
    }

    if (!isValidCuid(institutionId)) {
      res.status(400).json({ message: "Invalid institution id" });
      return;
    }

    if (
      !(await isMemberOfInstitution({
        userId: userId!,
        institutionId: institutionId,
      }))
    ) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const request = await getInstitutionRoomsWithAppointments(institutionId);

    return res.json(request);
  }
}
