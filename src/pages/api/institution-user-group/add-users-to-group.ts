import { getAuth } from "@clerk/nextjs/server";
import type { NextApiRequest, NextApiResponse } from "next";
import { isValidCuid } from "@/src/server/functions/server-input";
import {
  addUsersToInstitutionUserGroup,
  getInstitutionIdOfUserGroup,
} from "@/src/server/functions/server-institution-user-group";
import { isAdmin } from "../../../server/functions/server-role";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "POST") {
    const data = JSON.parse(req.body);
    const { userId } = getAuth(req);

    if (!data.groupId || !data.ids) {
      res.status(400).json({ message: "Invalid data" });
      return;
    }

    if (!isValidCuid(data.groupId))
      return res.status(400).json({ message: "Invalid group id" });

    const institutionId = await getInstitutionIdOfUserGroup(data.groupId);
    if (!institutionId) {
      res.status(404).json({ message: "Group institution not found" });
      return;
    }

    if (!(await isAdmin({ userId: userId!, institutionId: institutionId })))
      return res.status(401).json({ message: "Unauthorized" });

    const request = await addUsersToInstitutionUserGroup(
      data.ids,
      data.groupId,
      institutionId,
    );
    return res.json(request);
  }
}
