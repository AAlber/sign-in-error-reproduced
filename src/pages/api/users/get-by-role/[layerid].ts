import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../../server/db/client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "GET") {
    try {
      const layerId = req.query.layerid as string;
      const role = (req.query.role || "") as string;
      const institutionId = req.query.institution as string;
      if (!layerId || !institutionId) {
        res.status(400).json({ message: "Invalid layer id or instituion id" });
      }

      if (req.query.search) {
        const roles = await prisma.role.findMany({
          where: {
            institutionId: institutionId,
            layerId: layerId,
            role: {
              notIn: ["moderator", "admin"],
            },
            user: {
              OR: [
                {
                  name: {
                    contains: `${req.query.search ? req.query.search : ""}`,
                  },
                },

                {
                  email: {
                    contains: `${req.query.search ? req.query.search : ""}`,
                  },
                },
              ],
            },
          },
          include: {
            user: true,
          },
        });

        res.json(roles.map((r) => r.user));
      } else {
        const roles = await prisma.role.findMany({
          where: {
            institutionId: institutionId,
            layerId: layerId,
            role: {
              contains: role,
            },
          },
          include: {
            user: true,
          },
        });

        res.json(roles.map((r) => r.user));
      }
    } catch (e: any) {
      res.status(500).json({ message: e.message });
      throw new Error("Couldn't get role: " + e.message);
    }
  }
}
