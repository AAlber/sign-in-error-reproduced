import { getAuth } from "@clerk/nextjs/server";
import type { NextApiRequest, NextApiResponse } from "next";
import {
  getInstitutionIdOfRoom,
  getInstitutionRoomWithAppointments,
} from "@/src/server/functions/server-institution-room";
import { isValidCuid } from "../../../../server/functions/server-input";
import { isMemberOfInstitution } from "../../../../server/functions/server-role";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "GET") {
    const id = req.query.id as string;
    const { userId } = getAuth(req);

    if (!id) {
      res.status(400).json({ message: "Invalid data" });
      return;
    }

    if (!isValidCuid(id)) {
      res.status(400).json({ message: "Invalid room id" });
      return;
    }

    const institutionId = await getInstitutionIdOfRoom(id);
    if (!institutionId) {
      res.status(404).json({ message: "Room institution not found" });
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

    const request = await getInstitutionRoomWithAppointments(id);
    return res.json(request);
  }
}
