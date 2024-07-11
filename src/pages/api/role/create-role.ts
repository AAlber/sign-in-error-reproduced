import { getAuth } from "@clerk/nextjs/server";
import type { NextApiRequest, NextApiResponse } from "next";
import { isValidUserId } from "@/src/server/functions/server-input";
import {
  createOrUpdateRole,
  createSimpleRole,
  hasRolesWithAccess,
} from "@/src/server/functions/server-role";
import { checkInstitutionSubscriptionStatus } from "@/src/server/functions/server-stripe";
import {
  getCurrentInstitutionId,
  getUserData,
} from "@/src/server/functions/server-user";
import cacheRedisHandler from "@/src/utils/cache-handler/cache-redis-handler";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "POST") {
    const { userId, layerId, role } = JSON.parse(req.body) as CreateRoleApiArgs;

    const { userId: initiatorId } = getAuth(req);
    const institutionId = await getCurrentInstitutionId(initiatorId!);
    checkInstitutionSubscriptionStatus(institutionId as any);

    if (!layerId || !role || !userId) {
      return res.status(400).json({ message: "Missing parameters" });
    }

    if (!isValidUserId(userId)) {
      return res.status(400).json({ message: "Invalid user id" });
    }

    if (!institutionId)
      return res.status(400).json({ message: "No institution selected" });

    if (role === "admin") {
      if (
        !(await hasRolesWithAccess({
          userId: initiatorId!,
          layerIds: [institutionId],
          rolesWithAccess: ["admin"],
        }))
      ) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      await createSimpleRole({
        institutionId,
        layerId,
        role: "admin",
        userId,
        active: true,
      });
      await createOrUpdateRole({
        institutionId,
        layerId,
        role: "moderator",
        userId,
      });
    } else {
      const rolesWithAccess: Role[] =
        role === "member"
          ? ["admin", "moderator", "educator"]
          : ["admin", "moderator"];

      if (
        !(await hasRolesWithAccess({
          userId: initiatorId!,
          layerIds: [layerId],
          rolesWithAccess: rolesWithAccess,
        }))
      ) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      await createOrUpdateRole({
        institutionId,
        layerId,
        role,
        userId,
      });
    }

    const newUserData = await getUserData(userId!);
    await cacheRedisHandler.set("user-data", userId!, newUserData);

    return res.json({ message: "success" });
  }
}

export type CreateRoleApiArgs = {
  userId: string;
  layerId: string;
  role: Role;
};
