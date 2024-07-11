import { getAuth } from "@clerk/nextjs/server";
import type { NextApiRequest, NextApiResponse } from "next";
import { getInstitutionUserGroups } from "@/src/server/functions/server-institution-user-group";
import { getCurrentInstitutionId } from "@/src/server/functions/server-user";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "GET") {
    const search = req.query.search as string;
    const includeMembers = req.query.includeMembers as string;
    const includeMembersQ =
      typeof includeMembers === "string"
        ? includeMembers === "true"
        : undefined;

    const { userId } = getAuth(req);

    const currentInstitutionId = await getCurrentInstitutionId(userId!);
    if (!currentInstitutionId)
      return res.status(404).json({ message: "User institution not found" });

    const request = await getInstitutionUserGroups(
      currentInstitutionId,
      search ? search : "",
      includeMembersQ,
    );
    return res.json(request);
  }
}
