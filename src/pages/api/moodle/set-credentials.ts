import { getAuth } from "@clerk/nextjs/server";
import type { NextApiRequest, NextApiResponse } from "next";
import { moodleCredentialsSchema } from "@/src/components/institution-settings/setting-containers/insti-settings-moodle/schema";
import { setMoodleCredentials } from "@/src/server/functions/server-moodle";
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

    const body = JSON.parse(req.body);
    const { apiKey, siteUrl } = await moodleCredentialsSchema.parseAsync(body);

    try {
      const data = await setMoodleCredentials({
        apiKey,
        siteUrl,
        institutionId,
      });
      return res.json(data);
    } catch (e) {
      const err = e as HttpError;
      return res.status(err.status ?? 400).json({
        success: false,
        message: "Invalid Moodle credentials",
        context: err.message,
      });
    }
  }
}
