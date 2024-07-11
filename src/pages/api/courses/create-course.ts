import { getAuth } from "@clerk/nextjs/server";
import type { NextApiRequest, NextApiResponse } from "next";
import { checkInstitutionSubscriptionStatus } from "@/src/client-functions/client-stripe";
import { prisma } from "@/src/server/db/client";
import { isAdminModeratorOrEducator } from "@/src/server/functions/server-role";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "POST") {
    const data = JSON.parse(req.body);
    const { userId } = getAuth(req);

    const layer = await prisma.layer.findFirst({
      where: { id: data.layer_id },
    });

    if (!layer) {
      res.status(404).json({ message: "Layer not found" });
      return;
    }

    if (
      !(await isAdminModeratorOrEducator({
        userId: userId!,
        layerId: layer.parent_id!,
      }))
    ) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    const { active } = await checkInstitutionSubscriptionStatus();
    if (!active) {
      res.status(402).json({ message: "Payment Required" });
      return;
    }
    const request = await prisma.course.create({
      data: {
        name: data.name,
        layer_id: data.layer_id,
        institution_id: data.institution_id,
        color: data.color,
        icon: data.icon,
      },
    });

    res.json(request);
  }
}
