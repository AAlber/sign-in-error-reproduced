import { getAuth } from "@clerk/nextjs/server";
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/src/server/db/client";
import { sentry } from "@/src/server/singletons/sentry";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "GET") {
    try {
      const { userId } = getAuth(req);

      const e = await prisma.userAppointmentInvitationEmail.findFirst({
        where: { userId: userId! },
      });

      return res.status(200).json(e);
    } catch (error) {
      sentry.captureException(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
}
