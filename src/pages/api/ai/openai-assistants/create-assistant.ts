import { getAuth } from "@clerk/nextjs/server";
import type { NextApiRequest, NextApiResponse } from "next";
import type { VectorStore } from "openai/resources/beta/vector-stores/vector-stores";
import { getAIServerHandler } from "@/src/server/functions/server-ai/handler/server-ai";
import type {
  CreateAssistantRequest,
  CreateAssistantResponse,
} from "@/src/types/ai/ai-request-response.types";
import { log } from "@/src/utils/logger/logger";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CreateAssistantResponse>,
) {
  if (req.method === "POST") {
    const { userId } = getAuth(req);
    const data = JSON.parse(req.body) as CreateAssistantRequest;

    if (!data)
      return res.status(400).json({ ok: false, message: "No data provided" });

    const aiHandler = await getAIServerHandler(userId!);

    const statusData = await aiHandler.get.status();
    if (statusData.status !== "can-use")
      return aiHandler.handle.badBudgetResponse(statusData);

    try {
      let vectorStore: VectorStore;
      if (data.fileUrls) {
        const store = await aiHandler.create.openai_vectorStore(data.fileUrls);
        if (!store) throw new Error("Failed to create vector store");
        vectorStore = store;
      }

      const response = await aiHandler.create.openai_assistant({
        instructions: data.instructions,
        model: data.model,
        vectorStoreId: data.fileUrls ? vectorStore!.id : undefined,
      });

      if (!response.ok) throw new Error(response.message);

      res.json({
        ok: true,
        assistantId: response.assistant.id,
      });
    } catch (error) {
      log.error(error, "Error creating assistant").cli();
      res.status(500).json({
        ok: false,
        message: "An error occurred. Error: " + error,
      });
    }
  }
}
