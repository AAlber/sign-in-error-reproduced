import { getAuth } from "@clerk/nextjs/server";
import type { NextApiRequest, NextApiResponse } from "next";
import { getInstitutionSettings } from "@/src/server/functions/server-institution-settings";
import { deleteMoodleIntegration } from "@/src/server/functions/server-moodle";
import { hasRolesWithAccess } from "@/src/server/functions/server-role";
import { getCurrentInstitutionId } from "@/src/server/functions/server-user";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "DELETE") {
    const user = getAuth(req);
    const userId = user.userId!;

    const institutionId = await getCurrentInstitutionId(userId!);
    if (!institutionId)
      return res.status(400).json({ message: "No institution selected" });

    if (
      !(await hasRolesWithAccess({
        layerIds: [institutionId],
        rolesWithAccess: ["admin"],
        userId: userId!,
      }))
    ) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const institutionSettings = await getInstitutionSettings(institutionId);
    if (institutionSettings.integration_moodle) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete when moodle integration enabled",
      });
    }

    await deleteMoodleIntegration(institutionId);
    return res.json({ success: true });
  }
}
