import { getAuth } from "@clerk/nextjs/server";
import type { NextApiRequest, NextApiResponse } from "next";
import type { MoodleIntegrationDataPoint } from "@/src/components/institution-settings/setting-containers/insti-settings-moodle/schema";
import { getInstitutionSettings } from "@/src/server/functions/server-institution-settings";
import { syncMoodleDataPoints } from "@/src/server/functions/server-moodle";
import { hasRolesWithAccess } from "@/src/server/functions/server-role";
import { getCurrentInstitutionId } from "@/src/server/functions/server-user";
import type { HttpError } from "@/src/utils/exceptions/http-error";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "POST") {
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
    if (!institutionSettings.integration_moodle) {
      return res
        .status(400)
        .json({ success: false, message: "Moodle Integration not enabled" });
    }

    const dataPoints = JSON.parse(req.body) as MoodleIntegrationDataPoint;

    try {
      const data = await syncMoodleDataPoints({
        institutionId,
        userId,
        dataPoints,
      });

      return res.json({ success: true, data });
    } catch (e) {
      const err = e as HttpError;
      res
        .status(err.status || 500)
        .json({ success: false, message: err.message });
    }
  }
}
