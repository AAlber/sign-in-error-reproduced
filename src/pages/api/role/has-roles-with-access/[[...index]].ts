import { getAuth } from "@clerk/nextjs/server";
import type { NextApiRequest, NextApiResponse } from "next";
import { hasRolesWithAccess } from "@/src/server/functions/server-role";
import { isRole } from "@/src/utils/functions";
import { respondToPreflightEdgeRequest } from "@/src/utils/utils";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "OPTIONS") return respondToPreflightEdgeRequest(req);
  if (req.method === "GET") {
    const { userId: authedUserId } = getAuth(req);

    const params = req.query.index as string[];

    if (!params || params.length < 3) {
      return res.status(400).json({ message: "Insufficient parameters" });
    }

    const userId = params[0];
    const layerIds = params[1] ? params[1].split(",") : [];
    const roles: Role[] = params[2] ? params[2].split(",") : ([] as any);

    if (!userId || roles.some((role) => !isRole(role))) {
      res.status(400).json({ message: "Invalid data format" });
      return;
    }

    if (authedUserId !== userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const hasRole = await hasRolesWithAccess({
      layerIds: layerIds,
      userId,
      rolesWithAccess: roles,
    });

    res.setHeader(
      "Cache-Control",
      "max-age=0, s-maxage=1, stale-while-revalidate",
    );

    return res.json({
      hasRoleWithAccess: hasRole,
    });
  }
}
