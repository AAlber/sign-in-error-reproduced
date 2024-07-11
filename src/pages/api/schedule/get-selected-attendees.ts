import { getAuth } from "@clerk/nextjs/server";
import type { NextApiRequest, NextApiResponse } from "next";
import { getInstitutionUserGroupsByIds } from "@/src/server/functions/server-institution-user-group";
import {
  getCurrentInstitutionId,
  getLayersByLayerIds,
  getUsersByIds,
} from "@/src/server/functions/server-user";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "POST") {
    const { userId } = getAuth(req);
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const data = JSON.parse(req.body);

    const institutionId = await getCurrentInstitutionId(userId!);
    if (!institutionId)
      return res.status(400).json({ message: "No institutionId found" });

    // Getting users
    const users = await getUsersByIds(data.userAttendeeIds);
    const typedUsers = users.map((u) => ({
      type: "user",
      id: u.id,
      name: u.name,
      image: u.image,
    }));

    // Getting layers & courses
    const layers = await getLayersByLayerIds(userId, data.layerIds);
    const typedLayers = layers.map((l) => ({
      type: "layer",
      id: l.id,
      name: l.name,
      course: l.course,
    }));

    const userGroups = await getInstitutionUserGroupsByIds(
      data.userGroupAttendeeIds,
    );
    const typedUserGroups = userGroups.map((g) => ({
      type: "group",
      id: g.id,
      name: g.name,
      image: "",
    }));

    res.json([...typedUsers, ...typedLayers, ...typedUserGroups]);
  }
}
