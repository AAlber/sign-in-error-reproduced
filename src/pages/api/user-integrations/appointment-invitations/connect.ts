import { getAuth } from "@clerk/nextjs/server";
import type { NextApiRequest, NextApiResponse } from "next";
import { object, string } from "zod";
import { prisma } from "@/src/server/db/client";
import { sentry } from "@/src/server/singletons/sentry";

const schema = object({
  body: object({
    email: string().email("Invalid email"),
  }).strict(),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "POST") {
    try {
      const body = JSON.parse(req.body);

      const { userId } = getAuth(req);

      const data = schema.shape.body.safeParse(body);

      if (!data.success) {
        return res.status(400).json({ message: "Invalid data" });
      }

      const e = await prisma.userAppointmentInvitationEmail.findFirst({
        where: { userId: userId! },
      });

      if (e) {
        const result = await prisma.userAppointmentInvitationEmail.update({
          where: { id: e.id },
          data: { email: data.data.email },
        });

        return res.status(201).json(result);
      }

      const result = await prisma.userAppointmentInvitationEmail.create({
        data: {
          email: data.data.email,
          userId: userId!,
        },
      });

      return res.status(201).json(result);
    } catch (error) {
      sentry.captureException(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
}
