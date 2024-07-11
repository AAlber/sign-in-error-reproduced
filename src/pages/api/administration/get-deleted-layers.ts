import { getAuth } from "@clerk/nextjs/server";
import type { NextApiRequest, NextApiResponse } from "next";
import { getDeletedLayers } from "@/src/server/functions/server-administration";
import { hasRolesWithAccess } from "@/src/server/functions/server-role";
import { getCurrentInstitutionId } from "@/src/server/functions/server-user";
import { HttpError } from "@/src/utils/exceptions/http-error";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "GET") {
    const { userId } = getAuth(req);

    if (!userId) return res.status(404).json({ message: "User not found" });

    const institutionId = await getCurrentInstitutionId(userId);

    if (!institutionId)
      return res.status(400).json({ message: "No institution selected" });

    if (
      !(await hasRolesWithAccess({
        layerIds: [institutionId],
        userId,
        rolesWithAccess: ["admin"],
      }))
    )
      throw new HttpError("No access", 403);

    const data = await getDeletedLayers(institutionId);
    return res.json(data);
  }
}
