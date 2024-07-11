import { getAuth } from "@clerk/nextjs/server";
import type { NextApiRequest, NextApiResponse } from "next";
import { checkUsersCanBecomeActive } from "@/src/server/functions/server-access-passes/db-requests";
import { getCurrentInstitutionId } from "@/src/server/functions/server-user";
import type { SetStatusOfUsers } from "@/src/types/user-management.types";
import cacheRedisHandler from "@/src/utils/cache-handler/cache-redis-handler";
import {
  isAdmin,
  setStatusOfUsers,
} from "../../../server/functions/server-role";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "POST") {
    const data = JSON.parse(req.body) as SetStatusOfUsers;
    const { userId } = getAuth(req);

    if (!userId) return res.status(400).json({ message: "No userId provided" });

    const currentInstitutionId = await getCurrentInstitutionId(userId!);
    if (!currentInstitutionId)
      return res.status(400).json({ message: "No institution selected" });

    if (data.active) {
      const userIdsCanBecomeActive = await checkUsersCanBecomeActive({
        userIds: data.userIds,
        institutionId: currentInstitutionId,
      });
      if (!userIdsCanBecomeActive) {
        return res
          .status(402)
          .json({ message: "Exceeded max user limit of subscription." });
      }
    }

    if (
      !(await isAdmin({
        userId: userId!,
        institutionId: currentInstitutionId,
      }))
    ) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    if (data.userIds.includes(userId))
      return res.status(409).json({ message: "Cannot set your own status" });

    const result = await setStatusOfUsers(
      data.userIds,
      currentInstitutionId,
      data.active,
    );

    await cacheRedisHandler.invalidate.many("user-data", data.userIds);
    return res.json(result);
  }
}
