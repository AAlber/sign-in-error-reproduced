import { getAuth } from "@clerk/nextjs/server";
import type { NextApiRequest, NextApiResponse } from "next";
import {
  getInstitutionIdOfUserGroup,
  updateUserGroup,
} from "@/src/server/functions/server-institution-user-group";
import { isAdmin } from "../../../server/functions/server-role";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "POST") {
    const data = JSON.parse(req.body);
    const { userId } = getAuth(req);

    if (!data.id || !data.name || !data.color) {
      res.status(400).json({ message: "Invalid data" });
      return;
    }

    if (data.name.length > 200)
      return res.status(400).json({ message: "Name too long" });

    const institutionId = await getInstitutionIdOfUserGroup(data.id);
    if (!institutionId) {
      res.status(404).json({ message: "Group institution not found" });
      return;
    }

    if (!(await isAdmin({ userId: userId!, institutionId: institutionId })))
      return res.status(401).json({ message: "Unauthorized" });

    const request = await updateUserGroup(
      data.id,
      data.name,
      data.color,
      data.additionalInformation,
    );
    return res.json(request);
  }
}
