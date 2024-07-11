import { createClient } from "@vercel/edge-config";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "GET") {
    const config = createClient(process.env.EDGE_CONFIG);
    const allConfig = await config.getAll();
    return res.status(200).json(allConfig);
  }
}
