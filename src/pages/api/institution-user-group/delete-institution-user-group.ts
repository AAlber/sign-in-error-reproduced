import { getAuth } from "@clerk/nextjs/server";
import type { NextApiRequest, NextApiResponse } from "next";
import { deleteChatChannel } from "@/src/server/functions/server-chat";
import {
  deleteUserGroup,
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

    if (!data.id) {
      res.status(400).json({ message: "Invalid data" });
      return;
    }

    const institutionId = await getInstitutionIdOfUserGroup(data.id);
    if (!institutionId) {
      res.status(404).json({ message: "Group institution not found" });
      return;
    }

    if (!(await isAdmin({ userId: userId!, institutionId: institutionId }))) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const request = await deleteUserGroup(data.id);
    try {
      await deleteChatChannel(data.id);
    } catch (e) {
      // just catch  as will throw if group channel is not found
    }

    return res.json(request);
  }
}
