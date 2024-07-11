import type { NextApiRequest, NextApiResponse } from "next";
import { ServerAiHandler } from "@/src/server/functions/server-ai/handler/server-ai-handler";
import { getCurrentInstitutionId } from "@/src/server/functions/server-user";
import type { SupportedAIModel } from "@/src/types/ai";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    if (req.method === "POST") {
      const { userId, tokens, model } = JSON.parse(req.body) as {
        userId: string;
        tokens: number;
        model: SupportedAIModel;
      };

      const institutionId = await getCurrentInstitutionId(userId);
      if (!institutionId) throw new Error("No institution id");

      if (!userId)
        return res.status(400).json({ message: "No userId provided" });
      if (!tokens)
        return res.status(400).json({ message: "No tokens provided" });
      if (!model) return res.status(400).json({ message: "No model provided" });

      if (req.headers.authorization !== "Bearer " + process.env.FUXAM_SECRET) {
        return res.status(401).send("Unauthorized");
      }

      const aiHandler = new ServerAiHandler(institutionId);
      await aiHandler.create.usageLog(tokens, model);
      return res.status(200).json({ message: "Success" });
    }
  } catch (e) {
    console.error(e);
    res.status(500);
  }
}
