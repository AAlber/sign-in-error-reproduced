import * as Sentry from "@sentry/nextjs";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any | { message: string }>,
) {
  try {
    return res.json({ message: "Hello" });
  } catch (e) {
    const err = e as Error;
    Sentry.captureException(err);
    res.status(500).json({ message: err.message });
  }
}
