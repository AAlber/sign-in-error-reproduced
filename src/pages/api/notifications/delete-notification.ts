import { getAuth } from "@clerk/nextjs/server";
import type { NextApiRequest, NextApiResponse } from "next";
import NotificationService from "@/src/server/functions/server-notification";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "POST") {
    const data = JSON.parse(req.body);
    const { userId } = getAuth(req);

    try {
      const service = new NotificationService();
      await service.delete.single(userId!, data.id);
    } catch (error) {
      return res.status(404).json({ message: "Notification not found" });
    }

    return res.json({ message: "Notification deleted successfully" });
  }
}
