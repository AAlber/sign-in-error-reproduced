import { getAuth } from "@clerk/nextjs/server";
import type { NextApiRequest, NextApiResponse } from "next";
import { getCurrentInstitutionId } from "@/src/server/functions/server-user";
import { isValidUserId } from "../../../server/functions/server-input";
import {
  countAllAdminsOfInstitution,
  createSimpleRole,
  deleteAllRolesForInstitution,
  isAdmin,
} from "../../../server/functions/server-role";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "POST") {
    const data = JSON.parse(req.body);
    const { userId } = getAuth(req);

    if (!isValidUserId(data.userId)) {
      res.status(400).json({ message: "Invalid user id" });
      return;
    }

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

    const adminCount = await countAllAdminsOfInstitution(currentInstitutionId);
    if (adminCount <= 1)
      return res.status(409).json({ message: "Cannot remove last admin" });

    const response = await deleteAllRolesForInstitution(
      data.userId,
      currentInstitutionId,
    );

    await createSimpleRole({
      userId: data.userId!,
      layerId: currentInstitutionId,
      institutionId: currentInstitutionId,
      role: "member",
      active: true,
    });

    res.json(response);
  }
}
