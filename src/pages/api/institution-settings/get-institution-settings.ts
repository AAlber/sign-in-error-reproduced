import { getAuth } from "@clerk/nextjs/server";
import type { NextApiRequest, NextApiResponse } from "next";
import { getInstitutionSettings } from "@/src/server/functions/server-institution-settings";
import { getCurrentInstitutionId } from "@/src/server/functions/server-user";
import { sentry } from "@/src/server/singletons/sentry";
import { isAdminOfInstitution } from "../../../server/functions/server-role";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "GET") {
    const { userId } = getAuth(req);
    const institutionId = await getCurrentInstitutionId(userId!);
    if (!institutionId)
      return res.status(400).json({ message: "No institution selected" });

    sentry.setUser({ id: userId! });
    sentry.setContext("api/institution-settings/get-institution-setting", {
      userId,
      institutionId,
    });

    if (!(await isAdminOfInstitution(userId!, institutionId))) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    const settings = await getInstitutionSettings(institutionId);
    res.json(settings);
  }
}
