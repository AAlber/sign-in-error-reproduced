import { getAuth } from "@clerk/nextjs/server";
import type { NextApiRequest } from "next";
import { getAIEdgeHandler } from "@/src/server/functions/server-ai/handler/edge-ai";

export const runtime = "edge";

export default async function POST(req: Request) {
  if (req.method === "POST") {
    try {
      const { userId } = getAuth(req as unknown as NextApiRequest);

      const { prompt, system }: { prompt: string; system: string } =
        await req.json();

      const aiHandler = getAIEdgeHandler(userId!);
      return aiHandler.stream.text({
        model: "open-mixtral-8x7b",
        prompt,
        system,
      });
    } catch (error) {
      return new Response("Internal server error", { status: 500 });
    }
  }
}
