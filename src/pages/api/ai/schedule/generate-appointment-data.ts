import { getAIServerHandler } from "@/src/server/functions/server-ai/handler/server-ai";
import { GenerateAppointmentDataSchema } from "@/src/types/ai/ai-request-response.types";
import { log } from "@/src/utils/logger/logger";
import { getAuth } from "@clerk/nextjs/server";
import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "POST") {
    try {
      const { text } = JSON.parse(req.body) as {
        text: string;
      };

      log.context("GenerateAppointmentData", { text });

      const { userId } = getAuth(req);

      if (!text) {
        log.warn("No text provided");
        return res.status(400).json({ message: "No text provided" });
      }

      const aiHandler = await getAIServerHandler(userId!);
      const response = await aiHandler.generate.object({
        model: "open-mixtral-8x7b",
        schema: GenerateAppointmentDataSchema,
        system:
          "You role is to convert text into appointment data. You can only reply in JSON format! If the user says anything unrelated to appointments and schedule constraints just return the default settings. Today is " + new Date().toISOString() + ". Use this as context for relative dates. If the user mentions things like 'next week' you fill out the types relative to the current date.",
        prompt: text,
      });

      if (response.status !== "success")
        return res.status(response.code).json(response);

      return res.status(200).json(response.data);
    } catch (error) {
      log.error(error, "Error generating topics");
      res.status(500).json({ message: "Internal Server Error" });
    }
  } else {
    log.warn("Invalid request method", { method: req.method });
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
