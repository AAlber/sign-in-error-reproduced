import { getAuth } from "@clerk/nextjs/server";
import type { NextApiRequest, NextApiResponse } from "next";
import type { Theme } from "@/src/client-functions/client-institution-theme";
import { updateIntitutionTheme } from "@/src/server/functions/server-institution-theme";
import { isAdmin } from "@/src/server/functions/server-role";
import { getCurrentInstitutionId } from "@/src/server/functions/server-user";
import cacheRedisHandler from "@/src/utils/cache-handler/cache-redis-handler";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "PUT") {
    const { userId } = getAuth(req);

    const institutionId = await getCurrentInstitutionId(userId!);

    if (!institutionId)
      return res.status(400).json({ message: "No institution selected" });

    const hasPermission = await isAdmin({ userId: userId!, institutionId });

    if (!hasPermission)
      return res.status(401).json({ message: "Unauthorized" });

    const {
      paletteName,
      customTheme,
    }: {
      paletteName: Theme["name"];
      customTheme: string;
    } = JSON.parse(req.body);

    if (!paletteName)
      return res.status(400).json({ message: "No palette selected" });

    updateIntitutionTheme(paletteName, institutionId, customTheme)
      .then(async (institution) => {
        await cacheRedisHandler.invalidate.custom({
          prefix: "user-data",
          origin: "api/institution-theme/update-institution-theme.ts",
          searchParam: institutionId,
          type: "single",
        });
        return res.status(200).json(institution);
      })
      .catch((error) => {
        return res.status(500).json({ message: error.message });
      });
  }
}
