import { getAuth } from "@clerk/nextjs/server";
import type { NextApiRequest, NextApiResponse } from "next";
import { getUserInstitutions } from "../functions";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "GET") {
    const { userId } = getAuth(req);
    try {
      const institutions = await getUserInstitutions(userId!);
      res.json(institutions);
    } catch (e: any) {
      res.status(500).json({ message: e.message });
      throw new Error("Couldn't find user institutions:" + e.message);
    }
  }
}
