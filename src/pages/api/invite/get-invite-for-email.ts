import { getAuth } from "@clerk/nextjs/server";
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/src/server/db/client";
import { hasRolesWithAccess } from "@/src/server/functions/server-role";
import { getCurrentInstitutionId } from "@/src/server/functions/server-user";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "GET") {
    const { email } = req.query as { email: string };
    const { userId } = getAuth(req);

    if (!email) return res.status(400).json("No email");

    const institutionId = await getCurrentInstitutionId(userId!);
    if (!institutionId) return res.status(400).json("No institutionId");

    const hasAccess = await hasRolesWithAccess({
      layerIds: [institutionId],
      rolesWithAccess: ["admin"],
      userId: userId!,
    });

    if (!hasAccess) return res.status(401).json("No access");

    const invite = await prisma.invite.findFirst({
      where: {
        email,
        institution_id: institutionId,
        hasBeenUsed: false,
      },
    });

    return res.json(invite);
  }
}
