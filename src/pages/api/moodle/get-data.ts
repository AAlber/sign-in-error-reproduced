import { getAuth } from "@clerk/nextjs/server";
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/src/server/db/client";
import { getInstitutionSettings } from "@/src/server/functions/server-institution-settings";
import { hasRolesWithAccess } from "@/src/server/functions/server-role";
import { getCurrentInstitutionId } from "@/src/server/functions/server-user";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "GET") {
    const user = getAuth(req);
    const userId = user.userId!;

    const institutionId = await getCurrentInstitutionId(userId!);
    if (!institutionId)
      return res.status(400).json({ message: "No institution selected" });

    const institutionSettings = await getInstitutionSettings(institutionId);
    if (!institutionSettings.integration_moodle) {
      return res
        .status(400)
        .json({ success: false, message: "Moodle Integration not enabled" });
    }

    if (
      !(await hasRolesWithAccess({
        userId,
        layerIds: [institutionId],
        rolesWithAccess: ["admin"],
      }))
    ) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const data = await prisma.moodleIntegration.findFirst({
      where: { institutionId },
    });

    return res.json(data);
  }
}
