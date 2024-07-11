import { getAuth } from "@clerk/nextjs/server";
import type { NextApiRequest, NextApiResponse } from "next";
import { getUsersWithAvailability } from "@/src/server/functions/server-appointment";
import { getAllInstitutionUserGroups } from "@/src/server/functions/server-institution-user-group";
import {
  getCurrentInstitutionId,
  getLayersUserHasSpecialAccessTo,
} from "@/src/server/functions/server-user";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "GET") {
    const datetime = req.query.dateTime as string;
    const duration = req.query.duration as string;
    const search = req.query.search as string;

    if (!datetime)
      return res.status(400).json({ message: "No datetime provided" });
    if (!duration)
      return res.status(400).json({ message: "No duration provided" });

    const { userId } = getAuth(req);
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const institutionId = await getCurrentInstitutionId(userId!);
    if (!institutionId)
      return res.status(400).json({ message: "No institutionId found" });

    // Getting users
    const usersWithAvailability = (
      await getUsersWithAvailability(datetime, duration, institutionId, search)
    ).filter((user) => user.id !== userId);

    //Getting layers & courses
    const layers = await getLayersUserHasSpecialAccessTo(userId!);
    const typedLayers = layers.map((l) => ({
      type: "layer",
      id: l.id,
      name: l.name,
      course: l.course,
    }));

    const userGroups = await getAllInstitutionUserGroups(institutionId);

    const typedUserGroups = userGroups.map((ug) => ({
      type: "group",
      id: ug.id,
      name: ug.name,
      image: "",
    }));

    res.json([...typedLayers, ...usersWithAvailability, ...typedUserGroups]);
  }
}
