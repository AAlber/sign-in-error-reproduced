import { getAuth } from "@clerk/nextjs/server";
import type { Invite } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { getCurrentInstitutionId } from "@/src/server/functions/server-user";
import type { CreateInvite } from "@/src/types/invite.types";
import { log } from "@/src/utils/logger/logger";
import {
  create24hInvite,
  createEmailInvites,
  getRolesWithAccess,
} from "../../../server/functions/server-invite";
import { hasRolesWithAccess } from "../../../server/functions/server-role";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { userId } = getAuth(req);
  if (req.method === "POST") {
    const data: CreateInvite = JSON.parse(req.body);
    const institutionId = await getCurrentInstitutionId(userId!);
    if (!institutionId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    if (
      !(await hasRolesWithAccess({
        layerIds:
          data.inviteType === "email-institution"
            ? [institutionId]
            : [data.layerId],
        userId: userId!,
        rolesWithAccess: getRolesWithAccess(data.inviteType),
      }))
    ) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      let result: Invite | Invite[];
      switch (data.inviteType) {
        case "email-institution":
        case "email-layer":
          result = await createEmailInvites({
            ...data,
            institutionId,
            userId: userId!,
          });

          break;
        case "24h":
          result = await create24hInvite({
            ...data,
            institutionId,
            token: data.token,
          });
          break;
        //Could add email invites for access passes in the future here
      }
      return res.json(result);
    } catch (error) {
      log.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
  return res.status(400).json("Method Invalid");
}
