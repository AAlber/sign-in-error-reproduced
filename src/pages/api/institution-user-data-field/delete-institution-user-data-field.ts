import { getAuth } from "@clerk/nextjs/server";
import type { NextApiRequest, NextApiResponse } from "next";
import {
  deleteInstitutionUserDataField,
  getInstitutionUserDataField,
} from "@/src/server/functions/server-institution-user-data-field";
import { hasRolesWithAccess } from "@/src/server/functions/server-role";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "POST") {
    try {
      const { id } = req.query as { id: string };
      const { userId } = getAuth(req);

      if (!userId)
        return res
          .status(403)
          .json({ success: false, message: "No user id provided" });
      if (!id)
        return res
          .status(400)
          .json({ success: false, message: "No id provided" });

      const userDataField = await getInstitutionUserDataField(id);
      if (!userDataField) return res.status(404).json({ success: false });

      if (
        !(await hasRolesWithAccess({
          layerIds: [userDataField.institutionId],
          userId,
          rolesWithAccess: ["admin"],
        }))
      )
        return res.status(403).json({ success: false, message: "No access" });

      await deleteInstitutionUserDataField(id as string);
      return res.status(200).end();
    } catch (error) {
      res.status(500).json({ error: error });
    }
  } else {
    res.status(405).end();
  }
}
