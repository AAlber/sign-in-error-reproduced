import type { NextApiRequest, NextApiResponse } from "next";
import { countPendingInvitesForLayer } from "../../../../server/functions/server-invite";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "GET") {
    const layerId = req.query.layerId as string;
    const role = req.query.role as Role | undefined;
    if (!layerId)
      return res.status(400).json({ message: "No layerId provided" });
    const response = await countPendingInvitesForLayer(layerId, role);
    res.json(response);
  }
}
