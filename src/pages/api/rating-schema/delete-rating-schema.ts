import { getAuth } from "@clerk/nextjs/server";
import type { NextApiRequest, NextApiResponse } from "next";
import { deleteRatingSchema } from "@/src/server/functions/server-rating-schema";
import { isAdmin } from "@/src/server/functions/server-role";
import { getCurrentInstitutionId } from "@/src/server/functions/server-user";
import type { ServerDeleteRatingSchema } from "@/src/types/rating-schema.types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "POST") {
    const { userId } = getAuth(req);
    const institutionId = await getCurrentInstitutionId(userId!);
    if (!institutionId)
      return res.status(404).json({ message: "Institution not found" });
    if (
      !(await isAdmin({
        userId: userId!,
        institutionId,
      }))
    ) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const data: ServerDeleteRatingSchema = JSON.parse(req.body);

    if (!data) {
      return res.status(400).json({ message: "Bad request" });
    }

    if (!data.id) {
      return res.status(400).json({ message: "Bad request" });
    }

    const result = await deleteRatingSchema(data);
    return res.json(result);
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
