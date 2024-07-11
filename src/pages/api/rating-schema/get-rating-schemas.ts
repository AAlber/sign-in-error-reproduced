import { getAuth } from "@clerk/nextjs/server";
import type { NextApiRequest, NextApiResponse } from "next";
import { getRatingSchemas } from "@/src/server/functions/server-rating-schema";
import { hasRolesWithAccess } from "@/src/server/functions/server-role";
import { getCurrentInstitutionId } from "@/src/server/functions/server-user";
import type { RatingSchemaWithValues } from "@/src/types/rating-schema.types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "GET") {
    const { userId } = getAuth(req);
    const institutionId = await getCurrentInstitutionId(userId!);
    if (!institutionId)
      return res.status(404).json({ message: "Institution not found" });
    if (
      !(await hasRolesWithAccess({
        userId: userId!,
        layerIds: [institutionId],
        rolesWithAccess: ["admin", "moderator", "educator", "member"],
      }))
    ) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const result: RatingSchemaWithValues[] = await getRatingSchemas({
      institutionId,
    });
    return res.json(result);
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
