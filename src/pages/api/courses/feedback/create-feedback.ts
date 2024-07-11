import { getAuth } from "@clerk/nextjs/server";
import type { CourseFeedback } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/src/server/db/client";
import { hasAccessToLayer } from "@/src/server/functions/server-role";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const body = req.body;
  const { layerId, score, text } = JSON.parse(body) as Omit<
    CourseFeedback,
    "id" | "userId"
  >;

  try {
    const { userId } = getAuth(req);
    if (!userId) return res.status(401).json({ message: "UNAUTHORIZED" });

    if (!layerId || !score || !text)
      return res.status(400).json({ message: "Invalid Request" });

    const isAuthorized = await hasAccessToLayer({ userId, layerId });
    if (!isAuthorized) return res.status(403).json({ message: "UNAUTHORIZED" });

    const data: Omit<CourseFeedback, "id" | "createdAt" | "updatedAt"> = {
      layerId,
      score,
      text,
      userId,
    };

    /**
     * Makes sure only 1 record exists in db for the user in a given
     * course/layer
     */
    const result = await prisma.$transaction(async (tx) => {
      const exists = await tx.courseFeedback.findFirst({
        where: { layerId, userId },
      });

      return exists
        ? await tx.courseFeedback.update({
            data: { ...data, updatedAt: new Date() },
            where: { id: exists.id },
          })
        : await tx.courseFeedback.create({ data });
    });

    return res.json(result);
  } catch (e) {
    const err = e as Error;
    res.json({ message: err.message });
  }
}
