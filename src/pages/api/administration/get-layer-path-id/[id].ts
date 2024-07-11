import { getAuth } from "@clerk/nextjs/server";
import type { NextApiRequest, NextApiResponse } from "next";
import { getLayerPathId } from "@/src/server/functions/server-administration";
import { hasRoleAssociatedWithLayer } from "@/src/server/functions/server-role";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "GET") {
    const id = req.query.id as string;
    const { userId } = getAuth(req);
    if (!userId) return res.status(404).json({ message: "User not found" });

    const hasAccess = await hasRoleAssociatedWithLayer({
      userId: userId!,
      layerId: id,
    });
    if (!hasAccess) return res.status(401).json({ message: "Unauthorized" });

    const path = await getLayerPathId(id);

    res.setHeader(
      "Cache-Control",
      "max-age=0, s-maxage=1, stale-while-revalidate",
    );

    return res.json({ path });
  }
}
