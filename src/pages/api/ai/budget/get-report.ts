import { getAuth } from "@clerk/nextjs/server";
import type { NextApiRequest, NextApiResponse } from "next";
import { ServerAiHandler } from "@/src/server/functions/server-ai/handler/server-ai-handler";
import { isAdmin } from "@/src/server/functions/server-role";
import { getCurrentInstitutionId } from "@/src/server/functions/server-user";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "GET") {
    const { userId } = getAuth(req);

    const institutionId = await getCurrentInstitutionId(userId!);
    if (!institutionId)
      return res.status(400).json({ message: "No institution id" });

    const hasPermission = await isAdmin({ userId: userId!, institutionId });
    if (!hasPermission)
      return res.status(401).json({ message: "Unauthorized" });

    const aiHandler = new ServerAiHandler(institutionId!);
    const report = await aiHandler.get.status();
    return res.json(report);
  }
}
