import axios from "axios";
import type { NextApiRequest, NextApiResponse } from "next";
import { env } from "@/src/env/server.mjs";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (!req.headers.authorization) {
    return res.status(401).send("No authorization token");
  }

  if (req.headers.authorization !== "Bearer " + process.env.FUXAM_SECRET) {
    return res.status(401).send("Unauthorized");
  }

  if (req.method !== "POST") {
    return res.status(405).end();
  }

  const { route, keys } = req.body as { route: string; keys: string[] };

  if (!route || !keys) {
    return res.status(400).json({ message: "Invalid data" });
  }

  const axiosInstance = axios.create({
    baseURL: env.SERVER_URL,
    headers: {
      Authorization: `Bearer ${env.FUXAM_SECRET}`,
    },
  });

  const urls = keys.map((key) => route + key);

  await Promise.all(urls.map((url) => axiosInstance.get(url)));
  console.log("Invalidated " + urls.length + " cache entries");
  console.log(urls);
  return res.json({ message: "Invalidated " + urls.length + " cache entries" });
}
