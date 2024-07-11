import type { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "POST") {
    const { key } = JSON.parse(req.body);
    if (!key) return res.status(400).json({ message: "No key provided" });

    const openai = new OpenAI({
      apiKey: key,
    });

    try {
      const aiRes = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: "This is a test, reply with 'Hello, World!'",
          },
        ],
        temperature: 0.8,
        max_tokens: 10,
      });
      res.status(200).json({ message: "Key is valid", aiRes });
    } catch {
      res.status(400).json({ message: "Key is invalid" });
    }
  }
}
