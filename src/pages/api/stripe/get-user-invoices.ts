import { getAuth } from "@clerk/nextjs/server";
import type { NextApiRequest, NextApiResponse } from "next";
import { getInvoicesOfUser } from "@/src/server/functions/server-paid-access-passes";
import { isAdmin } from "@/src/server/functions/server-role";
import { getCurrentInstitutionId } from "@/src/server/functions/server-user";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "GET") {
    const userId = req.query.userId as string;
    const { userId: clerkUserId } = getAuth(req);
    const currentInstitutionId = await getCurrentInstitutionId(clerkUserId!);

    if (
      !clerkUserId ||
      !currentInstitutionId ||
      (userId !== clerkUserId &&
        !(await isAdmin({
          userId: clerkUserId,
          institutionId: currentInstitutionId,
        })))
    )
      return res.status(401).json("Unauthorized");

    const getsInstitutionView = userId !== clerkUserId;

    const result = await getInvoicesOfUser({
      userId,
      institutionId: getsInstitutionView ? currentInstitutionId : undefined,
    });
    res.json(result);
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
