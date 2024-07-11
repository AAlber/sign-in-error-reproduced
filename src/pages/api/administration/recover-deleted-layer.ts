import { getAuth } from "@clerk/nextjs/server";
import type { NextApiRequest, NextApiResponse } from "next";
import { recoverLayer } from "@/src/server/functions/server-administration";
import { hasRolesWithAccess } from "@/src/server/functions/server-role";
import { getCurrentInstitutionId } from "@/src/server/functions/server-user";
import { HttpError } from "@/src/utils/exceptions/http-error";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "POST") {
    const { layerId } = req.body;
    const { userId } = getAuth(req);
    if (!userId) return res.status(404).json({ message: "User not found" });
    const institutionId = await getCurrentInstitutionId(userId);
    if (!institutionId)
      return res.status(400).json({ message: "No institution selected" });

    if (!layerId)
      return res.status(400).json({ message: "No layer id provided" });

    if (
      !(await hasRolesWithAccess({
        layerIds: [institutionId],
        userId,
        rolesWithAccess: ["admin"],
      }))
    )
      throw new HttpError("No access", 403);

    const result = await recoverLayer(layerId, institutionId);
    return res.json(result);
  }
}
