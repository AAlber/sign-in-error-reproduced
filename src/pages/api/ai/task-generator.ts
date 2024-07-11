import { getAuth } from "@clerk/nextjs/server";
import type { NextApiRequest, NextApiResponse } from "next";
import { getOpenAIInstance } from "@/src/server/functions/server-institution-settings";
import { getCurrentInstitutionId } from "@/src/server/functions/server-user";

{
  /** @deprecated currently no ai credit calculation here, can delete after workbench update */
}
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "GET") {
    const { userId } = getAuth(req);
    const { exampleForAI, taskName, language, difficulty, prompt } = req.query;
    const institutionId = await getCurrentInstitutionId(userId!);
    if (!institutionId)
      return res.status(400).json({ message: "No institution selected" });

    const instance = await getOpenAIInstance(institutionId);

    const aiResponse = await instance.openai.chat.completions.create({
      model: "gpt-4-0125-preview",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful task creator assistant, giving back tasks in a specific stringified json format",
        },
        ...JSON.parse(exampleForAI as string),
        {
          role: "user",
          content:
            "give me a " +
            taskName +
            " task in the format of a parsable string in " +
            language +
            " with a difficulty of " +
            parseInt(difficulty as string) * 2 +
            "/10 for the input: " +
            prompt,
        },
      ],
    });

    res.json({
      content: aiResponse.choices[0]?.message?.content,
    });
  }
}
