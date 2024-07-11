import { getAuth } from "@clerk/nextjs/server";
import type { NextApiRequest, NextApiResponse } from "next";
import { deleteRatingSchemaValue } from "@/src/server/functions/server-rating-schema";
import { isAdmin } from "@/src/server/functions/server-role";
import { getCurrentInstitutionId } from "@/src/server/functions/server-user";
import type { DeleteRatingSchemaValue } from "@/src/types/rating-schema.types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "POST") {
    const { userId } = getAuth(req);
    const institutionId = await getCurrentInstitutionId(userId!);

    if (!institutionId)
      return res.status(404).json({ message: "Institution not found" });

    if (!(await isAdmin({ userId: userId!, institutionId }))) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const data: DeleteRatingSchemaValue = JSON.parse(req.body);

    try {
      const response = await deleteRatingSchemaValue(data);
      return res.status(200).json(response);
    } catch (error) {
      return res.status(500).json({ message: "Server Error" });
    }
  }
}
