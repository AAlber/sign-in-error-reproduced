import { getAuth } from "@clerk/nextjs/server";
import type { NextApiRequest, NextApiResponse } from "next";
import {
  getInstitutionUserDataFieldsById,
  getInstitutionUserDataValuesOfFields,
} from "@/src/server/functions/server-institution-user-data-field";
import { respondToPreflightRequest } from "@/src/utils/utils";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "OPTIONS") return respondToPreflightRequest(req, res);
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
          .json({ success: false, message: "Field IDs not provided" });

      const fieldIds = fieldIdsString.split(",");

      if (fieldIds.length < 1)
        return res
          .status(400)
          .json({ success: false, message: "Not enough fields selected" });

      if (!userIdsString)
        return res
          .status(400)
          .json({ success: false, message: "User IDs not provided" });

      const userIds = userIdsString.split(",");

      if (userIds.length < 1)
        return res
          .status(400)
          .json({ success: false, message: "Not enough users selected" });

      const userDataFields = await getInstitutionUserDataFieldsById(fieldIds);
      if (userDataFields.length === 0)
        return res.status(404).json({ success: false });

      const userData = await getInstitutionUserDataValuesOfFields(
        fieldIds,
        userIds,
      );

      // Assume que você deseja retornar o valor do primeiro campo solicitado para o primeiro usuário.
      const firstUserData = userData[0];
      const firstField = userDataFields[0]!.name;
      const value = firstUserData![firstField] || "";

      res.json({ value });
    } catch (error) {
      res.status(500).json({ error: error });
    }
  } else {
    res.status(405).end();
  }
}
