import { getAuth } from "@clerk/nextjs/server";
import type { NextApiRequest, NextApiResponse } from "next";
import {
  deleteInstitutionRoom,
  getInstitutionIdOfRoom,
} from "@/src/server/functions/server-institution-room";
import { isValidCuid } from "../../../server/functions/server-input";
import { isAdmin } from "../../../server/functions/server-role";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "POST") {
    const data = JSON.parse(req.body);
    const { userId } = getAuth(req);

    if (!data.id) {
      res.status(400).json({ message: "Invalid data" });
      return;
    }

    if (!isValidCuid(data.id)) {
      res.status(400).json({ message: "Invalid room id" });
      return;
    }

    const institutionId = await getInstitutionIdOfRoom(data.id);
    if (!institutionId) {
      res.status(404).json({ message: "Room institution not found" });
      return;
    }

    if (!(await isAdmin({ userId: userId!, institutionId: institutionId }))) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const request = await deleteInstitutionRoom(data.id, data.institutionId);
    return res.json(request);
  }
}
