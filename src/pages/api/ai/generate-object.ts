import { getAuth } from "@clerk/nextjs/server";
import { jsonSchemaToZod } from "json-schema-to-zod";
import type { NextApiRequest, NextApiResponse } from "next";
import { getAIServerHandler } from "@/src/server/functions/server-ai/handler/server-ai";
import type { GenerateObjectRequest } from "@/src/types/ai/ai-request-response.types";
import { log } from "@/src/utils/logger/logger";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "POST") {
    const { userId } = getAuth(req);
    const data = JSON.parse(req.body) as GenerateObjectRequest<any>;

    if (!data)
      return res.status(400).json({ ok: false, message: "No data provided" });

    console.log("data");
    console.log(data);
    const dataWithSchema = {
      ...data,
      schema: jsonSchemaToZod(data.schema),
    };

    const aiHandler = await getAIServerHandler(userId!);

    try {
      const response = await aiHandler.generate.object(dataWithSchema as any);
      if (response.status !== "success")
        return res.status(response.code).json(response);

      return res.status(200).json(response.data);
    } catch (error) {
      log.error(error, "Error creating assistant").cli();
      res.status(500).json({
        ok: false,
        message: "An error occurred. Error: " + error,
      });
    }
  }
}
