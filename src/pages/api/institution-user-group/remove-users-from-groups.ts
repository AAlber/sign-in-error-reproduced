import { getAuth } from "@clerk/nextjs/server";
import type { NextApiRequest, NextApiResponse } from "next";
import { removeUsersFromChannel } from "@/src/server/functions/server-chat/user-management";
import {
  getInstitutionUserGroup,
  removeUsersFromUserGroups,
} from "@/src/server/functions/server-institution-user-group";
import { isAdmin } from "@/src/server/functions/server-role";
import { getCurrentInstitutionId } from "@/src/server/functions/server-user";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "POST") {
    const { ids, groupIds } = JSON.parse(req.body) as {
      ids: string[];
      groupIds: string[];
    };
    const { userId } = getAuth(req);

    const currentInstitutionId = await getCurrentInstitutionId(userId!);
    if (!currentInstitutionId)
      return res.status(404).json({ message: "User institution not found" });

    const groupsPromise = Promise.all(
      groupIds.map((id) => getInstitutionUserGroup(id)),
    );
    const groups = await groupsPromise;
    if (groups.some((g) => !g))
      return res.status(404).json({ message: "Some groups not found" });

    const groupsOfInstitution = groups.filter(
      (g) =>
        g !== null &&
        g !== undefined &&
        g?.institutionId === currentInstitutionId,
    );
    if (groupsOfInstitution.length !== groupIds.length)
      return res
        .status(403)
        .json({ message: "Some groups not in current institution" });

    if (
      !(await isAdmin({ userId: userId!, institutionId: currentInstitutionId }))
    )
      return res.status(401).json({ message: "Unauthorized" });

    const request = await removeUsersFromUserGroups(ids, groupIds);

    try {
      const removeFromChannels = groupIds.map((group) =>
        removeUsersFromChannel(ids, group),
      );
      await Promise.all(removeFromChannels);
    } catch {
      console.log(
        "Cant remove user from chat channels, this might be that they do not exist for this group.",
      );
    }

    return res.json(request);
  }
}
