import { getAuth } from "@clerk/nextjs/server";
import type { NextApiRequest, NextApiResponse } from "next";
import { getUserData } from "@/src/server/functions/server-user";
import cacheRedisHandler from "@/src/utils/cache-handler/cache-redis-handler";
import { prisma } from "../../../server/db/client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "POST") {
    try {
      const data = JSON.parse(req.body);
      const { userId } = getAuth(req);
      const update = await updateUser(userId!, data);
      const newUserData = await getUserData(userId!);
      await cacheRedisHandler.set("user-data", userId!, newUserData);
      res.json(update);
    } catch (e: any) {
      res.status(500).json({ message: e.message });
    }
  }
}

async function updateUser(userId: string, data: any) {
  const update = await prisma.user.update({
    where: { id: userId },
    data: data,
  });
  return update;
}
