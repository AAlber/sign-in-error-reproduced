import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../server/db/client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "GET") {
    if (!req.query.courseIds && req.query.institution) {
      const response = await prisma.course.findMany({
        where: {
          institution_id: `${req.query.institution}`,
        },
      });
      res.json(response);
    } else if (req.query.courseIds && req.query.institution) {
      const response = await prisma.course.findMany({
        where: {
          institution_id: `${req.query.institution}`,
          layer_id: { in: (req.query.courseIds as string).split(",") },
        },
      });
      res.json(response);
    } else {
      const response = await prisma.course.findFirst({
        where: {
          layer_id: `${req.query.id}`,
        },
        include: {
          layer: true,
        },
      });
      res.json(response);
    }
  }
}
