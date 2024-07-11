import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../server/db/client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "POST") {
    if (req.headers.authorization !== "Bearer " + process.env.FUXAM_SECRET)
      return res.status(401).json({ message: "Unauthorized" });

    const data = JSON.parse(req.body);
    const response = await prisma.invite.deleteMany({
      where: { id: data.id },
    });
    return res.json(response);
  }
}
