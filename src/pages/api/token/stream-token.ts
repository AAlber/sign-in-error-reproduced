import { getAuth } from "@clerk/nextjs/server";
import type { NextApiRequest, NextApiResponse } from "next";
import { streamChat } from "@/src/server/functions/server-chat";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const { userId } = getAuth(req);
    if (!userId) throw new Error("Invalid request");

    const token = streamChat.createToken(userId);
    res.json({ token });
  } catch (e) {
    const error = e as Error;
    res.status(400).json(error.message);
  }
}
