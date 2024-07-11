import { getAuth } from "@clerk/nextjs/server";
import type { NextApiRequest, NextApiResponse } from "next";
import {
  getUsersWithAccess,
  isMemberOfInstitution,
} from "@/src/server/functions/server-role";
import { getCurrentInstitutionId } from "@/src/server/functions/server-user";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "GET") {
    const { userId } = getAuth(req);
    if (!userId) return res.status(400).json({ message: "No userId provided" });

    const institutionId = await getCurrentInstitutionId(userId);
    if (!institutionId)
      return res.status(400).json({ message: "No institutionId found" });

    const hasAccess = await isMemberOfInstitution({ userId, institutionId });
    if (!hasAccess) return res.status(401).json({ message: "Unauthorized" });

    const users = await getUsersWithAccess({
      layerId: institutionId,
      roleFilter: ["admin"],
    });
    return res.json(users);
  }
}
