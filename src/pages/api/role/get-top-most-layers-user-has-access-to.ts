import { getAuth } from "@clerk/nextjs/server";
import type { NextApiRequest, NextApiResponse } from "next";
import { hasRolesWithAccess } from "@/src/server/functions/server-role";
import {
  getCurrentInstitutionId,
  getTopMostLayersUserHasAccessTo,
} from "@/src/server/functions/server-user";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "GET") {
    const { userId } = getAuth(req);
    const { userId: reqUserId } = req.query as { userId: string };

    const institutionId = await getCurrentInstitutionId(userId!);

    if (!institutionId)
      return res.status(404).json({ message: "No institutionId found" });

    const hasAccess = await hasRolesWithAccess({
      layerIds: [institutionId],
      rolesWithAccess: ["admin"],
      userId: userId!,
    });

    if (!hasAccess) return res.status(401).json({ message: "Unauthorized" });

    const layers = await getTopMostLayersUserHasAccessTo(
      reqUserId,
      institutionId,
    );
    res.json(layers);
  }
}
