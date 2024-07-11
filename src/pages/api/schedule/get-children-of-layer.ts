import { getAuth } from "@clerk/nextjs/server";
import type { NextApiRequest, NextApiResponse } from "next";
import { getChildrenIdsOfLayer } from "@/src/server/functions/server-administration";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "GET") {
    const { userId } = getAuth(req);
    const { layerId } = req.query as {
      layerId: string;
    };

    if (!userId) return res.status(401).json({ message: "No access" });

    if (!layerId) {
      res.status(400).json({ message: "Invalid data" });
      return;
    }

    const childrenIds = await getChildrenIdsOfLayer(layerId);
    // return a list of childrenIds but not repeated values
    const notRepeatedChildrenIds = [...new Set(childrenIds)];

    if (!childrenIds)
      return res.status(404).json({ message: "Layers not found" });

    return res.status(200).json(notRepeatedChildrenIds);
  }
}
