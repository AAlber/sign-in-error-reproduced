import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../server/db/client";
import { getLayerWithChildrenAndUsers } from "../../../server/functions/server-administration";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "GET") {
    if (!req.query.layerIds && req.query.isCourse && req.query.institution) {
      const response = await prisma.layer.findFirst({
        where: {
          id: `${req.query.id}`,
          isCourse: true,
          institution_id: `${req.query.institution}`,
        },
      });
      res.json(response);
    } else if (
      req.query.layerIds &&
      req.query.institution &&
      !Boolean(req.query.includeChildren)
    ) {
      const response = await prisma.layer.findMany({
        where: {
          institution_id: `${req.query.institution}`,
          id: {
            in: (req.query.layerIds as string).split(","),
          },
          AND: {
            id: {
              not: `${req.query.institution}`,
            },
          },
        },
      });
      res.json(response);
    } else if (
      req.query.layerIds &&
      req.query.institution &&
      Boolean(req.query.includeChildren)
    ) {
      const response = await prisma.layer.findMany({
        where: {
          institution_id: `${req.query.institution}`,
          id: {
            in: (req.query.layerIds as string).split(","),
          },
          AND: {
            id: {
              not: `${req.query.institution}`,
            },
          },
        },
        include: {
          course: true,
          children: {
            orderBy: {
              name: "asc",
            },
          },
        },
      });

      res.json(response);
    } else {
      const response = await getLayerWithChildrenAndUsers(`${req.query.id}`);
      res.json(response);
    }
  }
}
