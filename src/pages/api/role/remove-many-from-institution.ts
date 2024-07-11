import { getAuth } from "@clerk/nextjs/server";
import type { NextApiRequest, NextApiResponse } from "next";
import { removeManyUsersFromInstitution as removeManyGetstreamUsersFromInstitution } from "@/src/server/functions/server-chat/user-management";
import { getCurrentInstitutionId } from "@/src/server/functions/server-user";
import removeUsersFromInstitution from "@/src/server/functions/server-user-mgmt";
import cacheRedisHandler from "@/src/utils/cache-handler/cache-redis-handler";
import { isAdmin } from "../../../server/functions/server-role";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "POST") {
    const data = JSON.parse(req.body);
    const { userId } = getAuth(req);

    const { userIds } = data as { userIds: string[] };

    if (!userIds) {
      res.status(400).json({ message: "No user ids provided" });
      return;
    }

    const currentInstitutionId = await getCurrentInstitutionId(userId!);
    if (!currentInstitutionId)
      return res.status(400).json({ message: "No institution selected" });

    if (
      !(await isAdmin({
        userId: userId!,
        institutionId: currentInstitutionId,
      }))
    ) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const response = await removeUsersFromInstitution(
      userIds,
      currentInstitutionId,
    );

    await removeManyGetstreamUsersFromInstitution(
      userIds,
      currentInstitutionId,
    );
    await cacheRedisHandler.invalidate.many("user-data", data.userIds);

    res.json(response);
  }
}
