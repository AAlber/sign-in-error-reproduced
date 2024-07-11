import { getAuth } from "@clerk/nextjs/server";
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/src/server/db/client";
import { getCurrentInstitutionId } from "@/src/server/functions/server-user";
import type { ServerHasRoleInInstitutionResponse } from "@/src/types/user-management.types";
import { respondToPreflightEdgeRequest } from "@/src/utils/utils";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "OPTIONS") return respondToPreflightEdgeRequest(req);
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { userId: authedUserId } = getAuth(req);

  const params = req.query.index as string[];

  if (!params || params.length < 2) {
    return res.status(400).json({ message: "Insufficient parameters" });
  }

  const userId = params[0];
  const roles = params[1] ? params[1].split(",") : [];

  if (authedUserId !== userId)
    return res.status(400).json({ message: "No id provided" });

  if (!roles) return res.status(400).json("No role provided");

  if (!userId) return res.status(403).json({ success: false });

  const institutionId = await getCurrentInstitutionId(userId);
  if (!institutionId) return res.status(404).json("Institution not found");

  const userRoles = await prisma.role.findMany({
    where: {
      userId: userId,
      institutionId: institutionId,
    },
  });

  res.setHeader(
    "Cache-Control",
    "max-age=0, s-maxage=1, stale-while-revalidate",
  );

  return res.json({
    hasRole:
      userRoles.filter((role) => roles.includes(role.role as any)).length > 0,
  } as ServerHasRoleInInstitutionResponse);
}
