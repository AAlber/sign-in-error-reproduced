import { getAuth } from "@clerk/nextjs/server";
import type { NextApiRequest, NextApiResponse } from "next";
import { getInstitutionUserGroup } from "@/src/server/functions/server-institution-user-group";
import {
  getCurrentInstitutionId,
  getUsersByIds,
} from "@/src/server/functions/server-user";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "GET") {
    const { id } = req.query as { id: string };
    const { userId } = getAuth(req);

    const currentInstitutionId = await getCurrentInstitutionId(userId!);
    if (!currentInstitutionId)
      return res.status(404).json({ message: "User institution not found" });

    const group = await getInstitutionUserGroup(id);
    if (!group) return res.status(404).json({ message: "Group not found" });
    if (currentInstitutionId !== group.institutionId)
      return res.status(401).json({ message: "Unauthorized" });

    const users = await getUsersByIds(group.members.map((m) => m.userId));
    const emails = users.map((u) => u.email);
    return res.json(emails);
  }
}
