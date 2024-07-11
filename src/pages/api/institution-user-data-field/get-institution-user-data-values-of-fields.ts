import { getAuth } from "@clerk/nextjs/server";
import type { NextApiRequest, NextApiResponse } from "next";
import {
  getInstitutionUserDataFieldsById,
  getInstitutionUserDataValuesOfFields,
} from "@/src/server/functions/server-institution-user-data-field";
import { hasRolesWithAccess } from "@/src/server/functions/server-role";
import { getUser } from "@/src/server/functions/server-user";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "GET") {
    try {
      const { userId } = getAuth(req);
      const fieldIdsString = req.query.fieldIds as string;
      const userIdsString = req.query.userIds as string;

      if (!userId)
        return res
          .status(403)
          .json({ success: false, message: "No user id provided" });

      if (!fieldIdsString)
        return res
          .status(400)
          .json({ success: false, message: "No id provided" });

      const fieldIds = fieldIdsString.split(",");

      if (fieldIds.length < 1)
        return res
          .status(400)
          .json({ success: false, message: "Not enough fields selected" });

      if (!userIdsString)
        return res
          .status(400)
          .json({ success: false, message: "No user ids provided" });

      const userIds = userIdsString.split(",");

      if (userIds.length < 1)
        return res
          .status(400)
          .json({ success: false, message: "Not enough users selected" });

      const userDataFields = await getInstitutionUserDataFieldsById(fieldIds);
      if (!!userDataFields.length) {
        if (
          !(await hasRolesWithAccess({
            layerIds: userDataFields.map((field) => field.institutionId),
            userId,
            rolesWithAccess: ["admin"],
          }))
        )
          return res
            .status(401)
            .json({ success: false, message: "Unauthorized" });
      }

      const user = await getUser(userId);
      const institutionUserDataField =
        await getInstitutionUserDataValuesOfFields(
          fieldIds,
          userIds,
          user?.language,
        );

      res.json(institutionUserDataField);
    } catch (error) {
      res.status(500).json({ error: error });
    }
  } else {
    res.status(405).end();
  }
}
