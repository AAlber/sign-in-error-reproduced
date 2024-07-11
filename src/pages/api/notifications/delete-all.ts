import { getAuth } from "@clerk/nextjs/server";
import type { NextApiRequest, NextApiResponse } from "next";
import NotificationService from "@/src/server/functions/server-notification";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "DELETE") {
    const { userId } = getAuth(req);

    const service = new NotificationService();
    await service.delete.all(userId!);

    return res.json({ message: "All notifications deleted successfully" });
  }
}
