import * as Sentry from "@sentry/nextjs";
import JWT from "jsonwebtoken";
import type { NextApiRequest, NextApiResponse } from "next";

const JWT_SECRET = process.env.TIPTAP_APP_SECRET || "";

export default async function Handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "POST") {
    try {
      const token = await JWT.sign({}, JWT_SECRET);

      res.status(201).json({ token });
    } catch (error) {
      Sentry.captureException(error);
      res.status(500).json({ error: (error as Error).message });
    }
  }
}
