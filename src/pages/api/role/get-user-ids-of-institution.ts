import { getAuth } from "@clerk/nextjs/server";
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/src/server/db/client";
import { isAdmin } from "@/src/server/functions/server-role";
import { getCurrentInstitutionId } from "@/src/server/functions/server-user";
import { sentry } from "@/src/server/singletons/sentry";
import { HttpError } from "@/src/utils/exceptions/http-error";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    if (req.method === "GET") {
      const user = getAuth(req);
      const userId = user.userId!;

      const institutionId = await getCurrentInstitutionId(userId);
      if (!institutionId) throw new HttpError("No institutionId found", 401);

      const hasAccess = await isAdmin({ userId: userId, institutionId });
      if (!hasAccess) throw new HttpError("Unauthorized");

      const users = await prisma.role.findMany({
        where: { institutionId },
        select: { userId: true },
        distinct: ["userId"],
      });

      const result = users.map((i) => i.userId);
      return res.json(result);
    }
  } catch (e) {
    sentry.captureException(e);
    const err = e as HttpError;
    res.status(err.status ?? 500).json({ message: err.message });
  }
}
