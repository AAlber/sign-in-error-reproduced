import { getAuth } from "@clerk/nextjs/server";
import type { NextApiRequest, NextApiResponse } from "next";
import {
  getInstitutionUserDataField,
  getUsersWithFieldValuesOfField,
} from "@/src/server/functions/server-institution-user-data-field";
import { hasRolesWithAccess } from "@/src/server/functions/server-role";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "GET") {
    try {
      const { userId } = getAuth(req);
      const fieldId = req.query.fieldId as string;

      if (!userId)
        return res
          .status(403)
          .json({ success: false, message: "No user id provided" });

      if (!fieldId)
        return res
          .status(400)
          .json({ success: false, message: "No id provided" });

      const userDataField = await getInstitutionUserDataField(fieldId);
      if (!userDataField) return res.status(404).json({ success: false });

      if (
        !(await hasRolesWithAccess({
          layerIds: [userDataField.institutionId],
          userId,
          rolesWithAccess: ["admin"],
        }))
      )
        return res.status(403).json({ success: false, message: "No access" });

      const institutionUserDataField = await getUsersWithFieldValuesOfField(
        userDataField.id,
      );
      res.json(institutionUserDataField);
    } catch (error) {
      res.status(500).json({ error: error });
    }
  } else {
    res.status(405).end();
  }
}
