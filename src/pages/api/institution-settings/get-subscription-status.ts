import { getAuth } from "@clerk/nextjs/server";
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/src/server/db/client";
import { getCurrentInstitutionId } from "@/src/server/functions/server-user";
import { isAdminOfInstitution } from "../../../server/functions/server-role";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "GET") {
    const { userId } = getAuth(req);
    const institutionId = await getCurrentInstitutionId(userId!);
    if (!institutionId)
      return res.status(400).json({ message: "No institution selected" });

    if (!(await isAdminOfInstitution(userId!, institutionId))) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    const stripeAcc = await prisma.institutionStripeAccount.findUnique({
      where: {
        institutionId: institutionId,
      },
    });
    res.json(stripeAcc?.subscriptionStatus);
  }
}
