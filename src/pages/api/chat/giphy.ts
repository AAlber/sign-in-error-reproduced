import fetch from "cross-fetch";
import type { MultiResponse } from "giphy-api";
import type { NextApiRequest, NextApiResponse } from "next";
import { env } from "@/src/env/server.mjs";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const search = req.query.search as string;
  const limit = (req.query.limit as string) ?? "20";
  const offset = (req.query.offset as string) ?? "5";
  const rating = (req.query.rating as string) ?? "g";

  const giphy = new URL("https://api.giphy.com/v1/gifs/search");
  giphy.searchParams.append("api_key", env.GIPHY_API_KEY);
  giphy.searchParams.append("q", search);
  giphy.searchParams.append("limit", limit);
  giphy.searchParams.append("offset", offset);
  giphy.searchParams.append("rating", rating);

  const r = await fetch(giphy.href);
  const { data } = (await r.json()) as MultiResponse;

  res.json(data);
}
