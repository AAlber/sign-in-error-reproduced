import { getAuth } from "@clerk/nextjs/server";
import type { NextApiRequest, NextApiResponse } from "next";
import {
  getSettingValues,
  includesProtectedSettingsValue,
} from "@/src/server/functions/server-institution-settings";
import { getCurrentInstitutionId } from "@/src/server/functions/server-user";
import { isAdminOfInstitution } from "../../../server/functions/server-role";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    if (req.method === "POST") {
      const { keys } = JSON.parse(req.body);
      if (!keys) return res.status(400).json({ message: "No keys provided" });
      const { userId } = getAuth(req);
      const institutionId = await getCurrentInstitutionId(userId!);
      if (!institutionId)
        return res.status(400).json({ message: "No institution selected" });

      if (
        includesProtectedSettingsValue(keys) &&
        !(await isAdminOfInstitution(userId!, institutionId))
      ) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }

      const settings = await getSettingValues(institutionId, keys);
      res.json(settings);
    }
  } catch (e) {
    throw new Error((e as Error).message);
  }
}
