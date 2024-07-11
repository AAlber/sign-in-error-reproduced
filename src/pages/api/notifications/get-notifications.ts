import { getAuth } from "@clerk/nextjs/server";
import type { NextApiRequest, NextApiResponse } from "next";
import NotificationService from "@/src/server/functions/server-notification";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "GET") {
    const { userId } = getAuth(req);

    const service = new NotificationService();
    const notifications = await service.get.all(userId!);
    await service.markAllAsRead(userId!);

    return res.json(notifications);
  }
}
