import { getAuth } from "@clerk/nextjs/server";
import type { NextApiRequest, NextApiResponse } from "next";
import { getInstitutionUserGroup } from "@/src/server/functions/server-institution-user-group";
import {
  getCurrentInstitutionId,
  getUsersByIds,
} from "@/src/server/functions/server-user";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "GET") {
    const { ids } = req.query as { ids: string };
    const { userId } = getAuth(req);

    const currentInstitutionId = await getCurrentInstitutionId(userId!);
    if (!currentInstitutionId)
      return res.status(404).json({ message: "User institution not found" });

    const groupsPromise = Promise.all(
      ids.split(",").map((id) => getInstitutionUserGroup(id)),
    );
    const groups = await groupsPromise;

    const groupsOfInstitution = groups.filter(
      (g) =>
        g !== null &&
        g !== undefined &&
        g?.institutionId === currentInstitutionId,
    );

    const userPromise = getUsersByIds(
      groupsOfInstitution.flatMap((g) => g!.members.map((m) => m.userId)),
    );
    const users = await userPromise;
    return res.status(200).json(users);
  }
}
