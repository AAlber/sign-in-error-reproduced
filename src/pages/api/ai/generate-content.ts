import { getAuth } from "@clerk/nextjs/server";
import * as Sentry from "@sentry/nextjs";
import type { NextApiRequest, NextApiResponse } from "next";
import { getOpenAIInstance } from "@/src/server/functions/server-institution-settings";
import { generateContentFromText } from "@/src/server/functions/server-openai/functions";
import { getCurrentInstitutionId } from "@/src/server/functions/server-user";
import type { ClientGenerateContentFromText } from "@/src/types/soon_deprecated_ai";

{
  /** @deprecated currently no ai credit calculation here, can delete after workbench update */
}
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "POST") {
    const { userId } = getAuth(req);
    const data = JSON.parse(req.body);

    const { prompt, requestedElements, language } =
      data as ClientGenerateContentFromText;
    if (!prompt) return res.status(400).json({ message: "No prompt provided" });
    if (!requestedElements)
      return res.status(400).json({ message: "No element types provided" });

    try {
      const institutionId = await getCurrentInstitutionId(userId!);
      if (!institutionId) {
        Sentry.captureMessage("Generate content: No institution selected", {
          level: "error",
        });
        return res.status(400).json({ message: "No institution selected" });
      }

      const instance = await getOpenAIInstance(institutionId);

      const content = await generateContentFromText({
        openAiInstance: instance.openai,
        prompt,
        requestedElements,
        language: language || "en",
      });

      return res.status(200).json({ content });
    } catch (e) {
      console.error(e);
      res.status(500);
    }
  }
}
