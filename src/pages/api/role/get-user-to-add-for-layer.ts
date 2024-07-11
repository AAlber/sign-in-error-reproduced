import { getAuth } from "@clerk/nextjs/server";
import type { NextApiRequest, NextApiResponse } from "next";
import {
  getUsersForAddingToLayer,
  hasRolesWithAccess,
} from "@/src/server/functions/server-role";
import { getCurrentInstitutionId } from "@/src/server/functions/server-user";
import type { GetUsersForAddingToLayer } from "@/src/types/user-management.types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "GET") {
    const { userId } = getAuth(req);
    const data: GetUsersForAddingToLayer = req.query as any;

    if (!data.layerId) return res.status(400).json({ message: "Invalid data" });

    if (!userId)
      return res.status(400).json({ message: "Invalid data format" });

    const institutionId = await getCurrentInstitutionId(userId);
    if (!institutionId)
      return res.status(400).json({ message: "No institution selected" });

    if (
      !(await hasRolesWithAccess({
        layerIds: [institutionId],
        userId,
        rolesWithAccess: ["admin", "moderator", "educator", "member"],
      }))
    )
      return res.status(401).json({ message: "Unauthorized" });

    const users = await getUsersForAddingToLayer({
      ...data,
      institutionId,
    });
    return res.json(users);
  }
}
