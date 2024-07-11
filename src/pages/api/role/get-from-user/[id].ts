import { getAuth } from "@clerk/nextjs/server";
import type { NextApiRequest, NextApiResponse } from "next";
import { isValidCuid } from "../../../../server/functions/server-input";
import { getRoles } from "../../../../server/functions/server-role";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "GET") {
    const institutionId = req.query.id as string;
    if (!institutionId) return res.json([]);
    if (!isValidCuid(institutionId)) return res.json([]);
    const { userId } = getAuth(req);

    const roles = await getRoles(userId!, institutionId);
    res.json(roles);
  }
}
