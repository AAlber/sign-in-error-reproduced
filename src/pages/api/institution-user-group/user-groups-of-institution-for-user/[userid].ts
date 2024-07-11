import { getAuth } from "@clerk/nextjs/server";
import type { NextApiRequest, NextApiResponse } from "next";
import { getUserGroupsOfInstitutionForUser } from "@/src/server/functions/server-institution-user-group";
import { isAdmin } from "@/src/server/functions/server-role";
import { getCurrentInstitutionId } from "@/src/server/functions/server-user";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "GET") {
    const id = req.query.userid as string;
    if (!id) return res.status(400).json({ message: "Invalid input" });

    const { userId } = getAuth(req);

    const institutionId = await getCurrentInstitutionId(userId!);
    if (!institutionId) {
      res.status(404).json({ message: "User institution not found" });
      return;
    }

    if (!(await isAdmin({ userId: userId!, institutionId: institutionId }))) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const groups = await getUserGroupsOfInstitutionForUser(id, institutionId);
    return res.status(200).json(groups);
  }
}
