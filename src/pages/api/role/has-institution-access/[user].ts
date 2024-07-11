import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../../server/db/client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "GET") {
    const response = await prisma.role.count({
      where: {
        userId: `${req.query.user}`,
        institutionId: `${req.query.institution}`,
        layerId: `${req.query.layer}`,
      },
    });
    res.json(response);
  }
}
