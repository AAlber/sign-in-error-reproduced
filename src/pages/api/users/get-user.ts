import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/src/server/db/client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "GET") {
    try {
      const data = req.query as { userId: string };

      const user: SimpleUser | null = await prisma.user.findUnique({
        where: {
          id: data.userId,
        },
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      return res.json(user);
    } catch (e: any) {
      res.status(500).json({ message: e.message });
      throw new Error("Couldn't find user or user institution:" + e.message);
    }
  }
}
