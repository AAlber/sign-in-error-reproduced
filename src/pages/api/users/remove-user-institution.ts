import { getAuth } from "@clerk/nextjs/server";
import type { NextApiRequest, NextApiResponse } from "next";
import {
  isAdmin,
  isMemberOfInstitution,
} from "@/src/server/functions/server-role";
import removeUsersFromInstitution from "@/src/server/functions/server-user-mgmt";
import { isValidCuid } from "../../../server/functions/server-input";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "POST") {
    const { id } = JSON.parse(req.body);
    const { userId } = getAuth(req);
    if (!id) {
      return res.status(400).json({ message: "No institution id provided" });
    }
    if (!isValidCuid(id)) {
      return res.status(400).json({ message: "Invalid institution id" });
    }
    if (
      !userId ||
      !(await isMemberOfInstitution({ userId, institutionId: id }))
    )
      return res.status(401).json({ message: "Unauthorized" });

    if (await isAdmin({ userId, institutionId: id }))
      return res
        .status(409)
        .json({ message: "Admins can't remove themselves." });

    const removed = await removeUsersFromInstitution([userId], id);

    return res.status(200).json({ removed });
  }
}
