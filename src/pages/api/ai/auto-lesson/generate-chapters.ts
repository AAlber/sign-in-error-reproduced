import { getAuth } from "@clerk/nextjs/server";
import axios from "axios";
import { isWithinTokenLimit } from "gpt-tokenizer";
import type { NextApiRequest, NextApiResponse } from "next";
import { getTextExtractor } from "office-text-extractor";
import { z } from "zod";
import { getAIServerHandler } from "@/src/server/functions/server-ai/handler/server-ai";
import { decodeAndGetKey } from "@/src/server/functions/server-cloudflare/utils";
import type { GenerateChaptersRequest } from "@/src/types/ai/ai-request-response.types";
import { log } from "@/src/utils/logger/logger";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "POST") {
    try {
      const data = JSON.parse(req.body) as GenerateChaptersRequest;
      log.context("GenerateTopicsDataServer", data);

      const { userId } = getAuth(req);

      if (!data) {
        log.warn("No data provided");
        return res.status(400).json({ message: "No data provided" });
      }
      if (!data.fileUrls) {
        log.warn("No fileUrls provided");
        return res.status(400).json({ message: "No fileUrls" });
      }

      const urls = data.fileUrls;
      log.info("File URLs", { urls });

      let mergedText = "";

      for (const url of urls) {
        const text = await getTextFromUrl(url);
        if (text) {
          mergedText += text + "\n\n";
        }
      }

      const fileTokenLimit = 120000;
      const tokenCount = isWithinTokenLimit(mergedText, fileTokenLimit);
      if (!tokenCount) {
        return res.status(413).json({ message: "Request entity too large" });
      }

      const withinTokenLimit = isWithinTokenLimit(mergedText, 16385);
      log.info("Within token limit", { withinTokenLimit });
      const aiHandler = await getAIServerHandler(userId!);
      const response = await aiHandler.generate.object({
        model: withinTokenLimit ? "gpt-3.5-turbo" : "gpt-4o",
        schema: z.object({
          chapters: z.array(
            z.object({
              id: z.string(),
              title: z.string(),
              description: z.string(),
            }),
          ),
        }),
        system:
          "Your role is to assist in structuring lessons. You'll receive the content or name of a lesson, and your task is to organize it into subtopics a logical order (min 5 max 10 topics)",
        prompt: mergedText,
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

async function getTextFromUrl(url: string) {
  log.info("Getting text from URL", { url });
  const extractor = getTextExtractor();
  const key = decodeAndGetKey(url);
  log.info("Decoded key", { key });

  try {
    const response = await axios.get(
      decodeURIComponent(url) + "?isFolder=false",
      {
        headers: {
          "X-CF-Secret": process.env.R2_AUTH_KEY_SECRET as string,
        },
        responseType: "arraybuffer",
      },
    );

    const fileBuffer = Buffer.from(response.data);
    const text = await extractor.extractText({
      type: "buffer",
      input: fileBuffer,
    });
    log.info("Extracted text successfully");
    return text;
  } catch (error) {
    log.error(error, `Error extracting text from ${key}`);
    return null;
  }
}
