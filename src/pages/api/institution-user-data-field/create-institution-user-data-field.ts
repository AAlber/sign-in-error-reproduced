import { getAuth } from "@clerk/nextjs/server";
import type { NextApiRequest, NextApiResponse } from "next";
import { createInstitutionUserDataField } from "@/src/server/functions/server-institution-user-data-field";
import { hasRolesWithAccess } from "@/src/server/functions/server-role";
import { getCurrentInstitutionId } from "@/src/server/functions/server-user";
import type { CreateInstitutionUserDataField } from "@/src/types/institution-user-data-field.types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "POST") {
    try {
      const { userId } = getAuth(req);
      const institutionUserDataField: CreateInstitutionUserDataField = req.body;

      if (!userId) return res.status(403).json({ success: false });
      if (!institutionUserDataField)
        return res.status(400).json({ success: false });
      if (!institutionUserDataField.name)
        return res.status(400).json({ success: false });

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

      const result = await createInstitutionUserDataField({
        ...institutionUserDataField,
        institutionId: institutionId,
      });
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error });
    }
  } else {
    res.status(405).end();
  }
}
