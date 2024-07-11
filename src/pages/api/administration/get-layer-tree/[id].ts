import { getAuth } from "@clerk/nextjs/server";
import type { NextApiRequest, NextApiResponse } from "next";
import { getLayersForUserBasedOnRoles } from "@/src/server/functions/server-administration-dashboard";
import { getCurrentInstitutionId } from "@/src/server/functions/server-user";
import { sentry } from "@/src/server/singletons/sentry";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "GET") {
    try {
      const id = req.query.id as string;
      const { userId } = getAuth(req);

      if (!userId) return res.status(404).json({ message: "User not found" });

      if (!id) return res.status(400).json({ error: "No id provided" });
      if (id !== userId) return res.status(403).json({ error: "Not allowed" });

      sentry.setUser({ id: userId });

      const institutionId = await getCurrentInstitutionId(userId);

      sentry.setContext("administration/get-layer-tree-hehe", {
        institutionId,
      });

      if (!institutionId)
        return res.status(400).json({ message: "No institution selected" });

      sentry.addBreadcrumb({
        message: "getting layers of user based on role",
      });

      const layerTree = await getLayersForUserBasedOnRoles(
        userId,
        institutionId,
      );

      return res.json(layerTree);
    } catch (e) {
      sentry.captureException(e);
      return res.status(400).json({ message: "error" });
    }
  }
}
