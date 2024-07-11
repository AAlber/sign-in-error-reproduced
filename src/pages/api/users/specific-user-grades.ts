import { getAuth } from "@clerk/nextjs/server";
import type { NextApiRequest, NextApiResponse } from "next";
import { hasRolesWithAccess } from "@/src/server/functions/server-role";
import {
  getCurrentInstitutionId,
  getUserCourseGrades,
} from "@/src/server/functions/server-user";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "GET") {
    const { userId: authUserId } = getAuth(req);
    const data = req.query as { userId: string; layerId?: string };
    const { layerId, userId: reqUserId } = data;

    if (!layerId) {
      const institutionId = await getCurrentInstitutionId(authUserId!);
      if (!institutionId)
        return res.status(400).json({ message: "No institution selected" });

      const hasAccess = await hasRolesWithAccess({
        layerIds: [institutionId],
        userId: authUserId!,
        rolesWithAccess: ["admin"],
      });

      if (!hasAccess) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const grades = await getUserCourseGrades({
        userId: reqUserId,
        layerId,
        institutionId,
      });
      return res.json(grades);
    }

    const hasAccess = await hasRolesWithAccess({
      layerIds: [layerId],
      userId: authUserId!,
      rolesWithAccess: ["admin", "moderator", "educator"],
    });
    if (!hasAccess) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const grades = await getUserCourseGrades({
      userId: reqUserId,
      layerId,
    });
    return res.json(grades);
  }
}
