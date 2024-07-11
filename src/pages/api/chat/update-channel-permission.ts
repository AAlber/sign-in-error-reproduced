import { getAuth } from "@clerk/nextjs/server";
import type { NextApiRequest, NextApiResponse } from "next";
import type { ConfigurablePermissions } from "@/src/components/reusable/page-layout/navigator/chat/types";
import { updateChannelPermission } from "@/src/server/functions/server-chat";
import { getChannelRole } from "@/src/server/functions/server-chat/user-management";
import { log } from "@/src/utils/logger/logger";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "PATCH") {
    const body = req.body;
    const { id, type, permission, value } = JSON.parse(
      body,
    ) as ToggleChannelPermissionBody;

    const { userId } = getAuth(req);
    if (!userId) {
      return res
        .status(403)
        .json({ success: false, message: "No user id provided" });
    }

    // we check if user is allowed to update channel on getstream side
    const role = await getChannelRole(userId, id, type);
    if (role === "member") {
      return res.status(403).json({
        success: false,
        message: "User not allowed to update channel settings",
      });
    }

    try {
      await updateChannelPermission(permission, id, type, value);
      res.json({ success: true });
    } catch (e) {
      const err = e as Error;
      log.error(err);
      res.status(400).json({ success: false, message: err.message });
    }
  }
}

export type ToggleChannelPermissionBody = {
  id: string;
  type: string;
  permission: ConfigurablePermissions;
  value: boolean;
};
