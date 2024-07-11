import { getAuth } from "@clerk/nextjs/server";
import type { NextApiRequest, NextApiResponse } from "next";
import type { CreateGroupArgs } from "@/src/server/functions/server-institution-user-group";
import { createUserGroup } from "@/src/server/functions/server-institution-user-group";
import { getCurrentInstitutionId } from "@/src/server/functions/server-user";
import { isAdmin } from "../../../server/functions/server-role";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "POST") {
    const data = JSON.parse(req.body) as CreateGroupArgs[];
    const { userId } = getAuth(req);

    const institutionId = await getCurrentInstitutionId(userId!);
    if (!institutionId)
      return res.status(400).json({ message: "Missing institution" });

    if (!data.every((i) => i.name && i.color)) {
      res.status(400).json({ message: "Invalid data" });
      return;
    }

    if (data.some((i) => i.name.length > 200))
      return res.status(400).json({ message: "Some group names are too long" });

    if (!(await isAdmin({ userId: userId!, institutionId })))
      return res.status(401).json({ message: "Unauthorized" });

    const request = await createUserGroup(
      data.map(({ additionalInformation, color, id, name }) => ({
        id,
        name,
        color,
        institutionId,
        additionalInformation,
      })),
    );

    return res.json(request);
  }
}
