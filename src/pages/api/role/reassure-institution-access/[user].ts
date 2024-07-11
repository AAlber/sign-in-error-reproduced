import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../../server/db/client";
import { isValidUserId } from "../../../../server/functions/server-input";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "POST") {
    if (!req.query.user || !isValidUserId(`${req.query.user}`)) {
      res.status(400).json({ message: "Invalid user id" });
      return;
    }

    if (req.headers.authorization !== "Bearer " + process.env.FUXAM_SECRET)
      return res.status(401).json({ message: "Unauthorized" });

    const response = await prisma.role.count({
      where: {
        userId: `${req.query.user}`,
        layerId: `${req.query.institutionId}`,
        institutionId: `${req.query.institutionId}`,
        role: {
          notIn: ["moderator", "admin"],
        },
      },
    });

    if (response === 0) {
      const request = await prisma.role.create({
        data: {
          userId: `${req.query.user}`,
          layerId: `${req.query.institutionId}`,
          institutionId: `${req.query.institutionId}`,
          role: "member",
        },
      });
      res.json(request);
    } else {
      res.status(200).json({ message: "User already member of institution." });
    }
  }
}
