import { getAuth } from "@clerk/nextjs/server";
import type { NextApiRequest, NextApiResponse } from "next";
import { getAIServerHandler } from "@/src/server/functions/server-ai/handler/server-ai";
import { getCurrentInstitutionId } from "@/src/server/functions/server-user";
import { plannerConstraintsSchema } from "@/src/types/planner/planner.types";
import { log } from "@/src/utils/logger/logger";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "POST") {
    try {
      const { userId } = getAuth(req);

      const { input } = JSON.parse(req.body) as {
        input: string;
      };

      log.context("AI Fillout", { input });

      const institutionId = await getCurrentInstitutionId(userId!);
      if (!institutionId) {
        log.warn("No current institution id");
        return res.status(404).json({ message: "No institution" });
      }

      if (!input) {
        log.warn("No text provided");
        return res.status(403).json({ message: "No input provided" });
      }

      const ai = await getAIServerHandler(userId!);

      console.log("AI Fillout", input);

      const response = await ai.generate.object({
        model: "gpt-4o",
        schema: plannerConstraintsSchema,
        system:
          "Look at the users constraints and update them to match the new requirements.",
        messages: [
          {
            role: "user",
            content: input,
          },
        ],
      });

      if (response.status !== "success") {
        log.warn("AI planner fillout response not successful", response);
        throw new Error("AI planner fillout response not successful");
      }

      return res.status(200).json({ constraints: response.data });
    } catch (error) {
      log.error(error);
      res.status(500).json({ message: error });
    }
  } else {
    log.warn("Method not allowed");
    res.status(405).end();
  }
}
