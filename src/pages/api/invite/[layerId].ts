import type { NextApiRequest, NextApiResponse } from "next";
import type { InviteWithLayerAndAccessPassAndInstitution } from "@/src/types/invite.types";
import { prisma } from "../../../server/db/client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "GET") {
    if (req.query.token) {
      const response: InviteWithLayerAndAccessPassAndInstitution[] =
        await prisma.invite.findMany({
          where: {
            target: `${req.query.layerId}`,
            token: `${req.query.token}`,
          },
          include: {
            layer: true,
            institution: true,
          },
        });
      if (response.length === 0)
        return res.status(404).json("Active invite not found");
      res.json(response[0]);
    } else {
      throw new Error("No token provided");
    }
  }
}
