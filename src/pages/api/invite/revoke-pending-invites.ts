import { getAuth } from "@clerk/nextjs/server";
import type { NextApiRequest, NextApiResponse } from "next";
import { revokePendingInvitesForLayer } from "../../../server/functions/server-invite";
import { isAdminModeratorOrEducator } from "../../../server/functions/server-role";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "POST") {
    const { layerId } = JSON.parse(req.body);
    const { userId } = getAuth(req);
    if (!layerId)
      return res.status(400).json({ message: "No layerId provided" });
    if (
      !(await isAdminModeratorOrEducator({ userId: userId!, layerId: layerId }))
    ) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const response = await revokePendingInvitesForLayer(layerId);
    return res.json(response);
  }
}
