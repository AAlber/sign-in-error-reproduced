import type { NextApiRequest, NextApiResponse } from "next";
import { getTotalActiveUsersOfInstitution } from "@/src/server/functions/server-role";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "GET") {
    const response = await getTotalActiveUsersOfInstitution(
      req.query.institution as string,
      req.query.countAccessPassUsers === "true",
    );
    res.json(response);
  }
}
