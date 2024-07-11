import { getAuth } from "@clerk/nextjs/server";
import type { NextApiRequest, NextApiResponse } from "next";
import { removeUsersFromChannel } from "@/src/server/functions/server-chat/user-management";
import {
  getAllInstitutionUserGroups,
  removeUsersFromUserGroups,
} from "@/src/server/functions/server-institution-user-group";
import { isAdmin } from "@/src/server/functions/server-role";
import { getCurrentInstitutionId } from "@/src/server/functions/server-user";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "POST") {
    const { ids } = JSON.parse(req.body) as { ids: string[] };
    const { userId } = getAuth(req);

    const currentInstitutionId = await getCurrentInstitutionId(userId!);
    if (!currentInstitutionId)
      return res.status(404).json({ message: "User institution not found" });

    if (
      !(await isAdmin({ userId: userId!, institutionId: currentInstitutionId }))
    )
      return res.status(401).json({ message: "Unauthorized" });

    const groupsOfInstitution =
      await getAllInstitutionUserGroups(currentInstitutionId);
    if (groupsOfInstitution.length === 0)
      return res.status(200).json({ message: "No groups in institution" });

    const groupIds = groupsOfInstitution.map((g) => g.id);
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
