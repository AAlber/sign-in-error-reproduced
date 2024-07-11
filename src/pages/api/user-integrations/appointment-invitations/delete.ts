import { getAuth } from "@clerk/nextjs/server";
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/src/server/db/client";
import { sentry } from "@/src/server/singletons/sentry";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "DELETE") {
    try {
      const { userId } = getAuth(req);

      await prisma.userAppointmentInvitationEmail.deleteMany({
        where: { userId: userId! },
      });

      return res.status(201).json({ success: true });
    } catch (error) {
      sentry.captureException(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
}
