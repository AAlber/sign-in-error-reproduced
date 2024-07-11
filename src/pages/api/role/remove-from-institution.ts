import { getAuth } from "@clerk/nextjs/server";
import type { NextApiRequest, NextApiResponse } from "next";
import { removeUserFromInstitution } from "@/src/server/functions/server-chat/user-management";
import { getCurrentInstitutionId } from "@/src/server/functions/server-user";
import removeUsersFromInstitution from "@/src/server/functions/server-user-mgmt";
import { isAdmin } from "../../../server/functions/server-role";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "POST") {
    const data = JSON.parse(req.body) as Body;
    const { userId } = getAuth(req);

    const currentInstitutionId = await getCurrentInstitutionId(userId!);
    if (!currentInstitutionId)
      return res.status(400).json({ message: "No institution selected" });

    if (
      !(await isAdmin({
        userId: userId!,
        institutionId: currentInstitutionId,
      }))
    ) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const response = await removeUsersFromInstitution(
      [data.userId],
      currentInstitutionId,
    );

    await removeUserFromInstitution(data.userId, currentInstitutionId);

    res.json(response);
  }
}

type Body = {
  userId: string;
};
