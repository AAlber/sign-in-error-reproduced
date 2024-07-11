import { getAuth } from "@clerk/nextjs/server";
import type { NextApiRequest, NextApiResponse } from "next";
import {
  getInstitutionUserDataField,
  updateInstitutionUserDataField,
} from "@/src/server/functions/server-institution-user-data-field";
import { hasRolesWithAccess } from "@/src/server/functions/server-role";
import type { UpdateInstitutionUserDataField } from "@/src/types/institution-user-data-field.types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "PUT") {
    try {
      const { userId } = getAuth(req);
      const data: UpdateInstitutionUserDataField = req.body;

      if (!userId) return res.status(403).json({ success: false });

      const userDataField = await getInstitutionUserDataField(data.id);
      if (!userDataField) return res.status(404).json({ success: false });

      if (
        !(await hasRolesWithAccess({
          layerIds: [userDataField.institutionId],
          userId,
          rolesWithAccess: ["admin"],
        }))
      )
        return res.status(403).json({ success: false, message: "No access" });

      const result = await updateInstitutionUserDataField(data);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error });
    }
  } else {
    res.status(405).end();
  }
}
