import type { NextApiRequest, NextApiResponse } from "next";
import { ServerAiHandler } from "@/src/server/functions/server-ai/handler/server-ai-handler";
import { getCurrentInstitutionId } from "@/src/server/functions/server-user";
import type { AIBudgetStatus } from "@/src/types/ai";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<AIBudgetStatus | { message: string }>,
) {
  try {
    if (req.method === "POST") {
      const { userId } = JSON.parse(req.body) as {
        userId: string;
      };

      if (!userId)
        return res.status(400).json({ message: "No userId provided" });

      if (req.headers.authorization !== "Bearer " + process.env.FUXAM_SECRET) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const institutionId = await getCurrentInstitutionId(userId!);
      if (!institutionId)
        return res.status(404).json({ message: "No institution" });

      const aiHandler = new ServerAiHandler(institutionId!);
      const status = await aiHandler.get.status();

      return res.status(200).json(status);
    }
  } catch (e) {
    console.error(e);
    res.status(500);
  }
}
