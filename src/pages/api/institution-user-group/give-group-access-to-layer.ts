import { getAuth } from "@clerk/nextjs/server";
import type { NextApiRequest, NextApiResponse } from "next";
import { getSimpleLayer } from "@/src/server/functions/server-administration";
import {
  getInstitutionIdOfUserGroup,
  getInstitutionUserGroup,
} from "@/src/server/functions/server-institution-user-group";
import {
  createOrUpdateRole,
  hasRoleAssociatedWithLayer,
  isAdminOrModerator,
} from "../../../server/functions/server-role";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "POST") {
    const data = JSON.parse(req.body);
    const { userId } = getAuth(req);

    if (!data.groupId)
      return res.status(400).json({ message: "Invalid group id" });

    if (!data.layerId)
      return res.status(400).json({ message: "Invalid layer id" });

    const institutionId = await getInstitutionIdOfUserGroup(data.groupId);
    if (!institutionId)
      return res.status(404).json({ message: "Group institution not found" });

    const group = await getInstitutionUserGroup(data.groupId);
    if (!group) return res.status(404).json({ message: "Group not found" });

    const layer = await getSimpleLayer(data.layerId);
    if (!layer) return res.status(404).json({ message: "Layer not found" });

    if (!(await isAdminOrModerator({ userId: userId!, layerId: layer.id })))
      return res.status(401).json({ message: "Unauthorized" });

    const users = group.members.map((m) => m.userId);

    // filter out users that already have access
    const usersWithAccess = await Promise.all(
      users.map((u) =>
        hasRoleAssociatedWithLayer({ userId: u, layerId: layer.id }),
      ),
    );
    const usersWithoutAccess = users.filter(
      (u, i) => usersWithAccess[i] === false,
    );

    const rolePromises = usersWithoutAccess.map((u) =>
      createOrUpdateRole({
        userId: u,
        layerId: layer.id,
        institutionId,
        role: "member",
      }),
    );

    const request = await Promise.all(rolePromises);

    return res.json(request);
  }
}
