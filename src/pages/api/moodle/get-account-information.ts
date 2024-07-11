import { getAuth } from "@clerk/nextjs/server";
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/src/server/db/client";
import { MoodleWebServiceClient } from "@/src/server/functions/server-moodle/moodle-client";
import { hasRolesWithAccess } from "@/src/server/functions/server-role";
import { getCurrentInstitutionId } from "@/src/server/functions/server-user";
import type { HttpError } from "@/src/utils/exceptions/http-error";

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

    try {
      const { apiKey, siteUrl } =
        await prisma.moodleIntegration.findFirstOrThrow({
          where: { institutionId },
        });

      const moodleClient = new MoodleWebServiceClient(apiKey, siteUrl);
      const data = await moodleClient.getSiteInfo();
      return res.json(data);
    } catch (e) {
      const err = e as HttpError;
      res
        .status(err.status || 500)
        .json({ success: false, message: err.message });
    }
  }
}
