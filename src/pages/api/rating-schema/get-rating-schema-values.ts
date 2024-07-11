import { getAuth } from "@clerk/nextjs/server";
import type { NextApiRequest, NextApiResponse } from "next";
import { getRatingSchemaValues } from "@/src/server/functions/server-rating-schema";
import { hasRolesWithAccess } from "@/src/server/functions/server-role";
import { getCurrentInstitutionId } from "@/src/server/functions/server-user";
import type { GetRatingSchemaValues } from "@/src/types/rating-schema.types";

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

    const data: GetRatingSchemaValues = req.query as any;

    try {
      const response = await getRatingSchemaValues(data);
      response.sort((a, b) => b.min - a.min);
      return res.status(200).json(response);
    } catch (error) {
      return res.status(500).json({ message: "Server Error" });
    }
  }
}
