import { getAuth } from "@clerk/nextjs/server";
import type { NextApiRequest, NextApiResponse } from "next";
import { getInstitutionUserDataFields } from "@/src/server/functions/server-institution-user-data-field";
import { hasRolesWithAccess } from "@/src/server/functions/server-role";
import { getCurrentInstitutionId } from "@/src/server/functions/server-user";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "GET") {
    try {
      const { userId } = getAuth(req);

      if (!userId)
        return res
          .status(403)
          .json({ success: false, message: "No user id provided" });

      const institutionId = await getCurrentInstitutionId(userId);
      if (!institutionId)
        return res
          .status(404)
          .json({ success: false, message: "Institution not found" });

      if (
        !(await hasRolesWithAccess({
          layerIds: [institutionId],
          userId,
          rolesWithAccess: ["admin"],
        }))
      )
        return res.status(403).json({ success: false, message: "No access" });

      const includeValuesQ = req.query.includeValues;
      const includeValues =
        typeof includeValuesQ === "string" ? includeValuesQ === "true" : true;

      const institutionUserDataField = await getInstitutionUserDataFields(
        institutionId,
        includeValues,
      );

      res.json(institutionUserDataField);
    } catch (error) {
      res.status(500).json({ error: error });
    }
  } else {
    res.status(405).end();
  }
}
