import { getAuth } from "@clerk/nextjs/server";
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/src/server/db/client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "GET") {
    const layerId = req.query.layerId as string;
    const role = req.query.role as Role | undefined;
    const take = req.query.take as string;
    const cursor = req.query.cursor as string;
    const search = req.query.search as string;
    // if we should exclude the logged in user from the search
    const excludeAuthUser = req.query.excludeAuth as string;

    const { userId } = getAuth(req);

    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const users = await prisma.user.findMany({
      where: {
        roles: { some: { layerId, ...(role ? { role } : {}) } },
        ...(search
          ? {
              OR: [
                { name: { contains: search } },
                { email: { contains: search } },
              ],
            }
          : {}),
        ...(excludeAuthUser && +excludeAuthUser === 1
          ? {
              id: {
                not: { equals: userId },
              },
            }
          : {}),
      },
      take: take ? parseInt(take) : 99,
      ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
    });

    res.json(users);
  }
}
