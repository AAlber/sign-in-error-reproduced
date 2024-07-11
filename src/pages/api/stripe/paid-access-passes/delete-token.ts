import type { NextApiRequest, NextApiResponse } from "next";
import { deleteValidatorToken } from "@/src/server/functions/server-paid-access-passes/db-requests";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "POST") {
    if (req.headers.authorization !== "Bearer " + process.env.FUXAM_SECRET) {
      return res.status(401).send("Unauthorized");
    }

    const { userId, token }: { userId: string; token: string } = JSON.parse(
      req.body,
    );
    if (!userId || !token) {
      return res.status(400).json({ message: "Bad request" });
    }
    const result = await deleteValidatorToken({ userId, token });

    return res.json(result);
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
