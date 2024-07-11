import { getAuth } from "@clerk/nextjs/server";
import type { NextApiRequest, NextApiResponse } from "next";
import { object, string } from "zod";
import { prisma } from "@/src/server/db/client";
import { isAdmin } from "@/src/server/functions/server-role";
import {
  getCurrentInstitutionId,
  getUser,
} from "@/src/server/functions/server-user";
import { log } from "@/src/utils/logger/logger";

const schema = object({
  body: object({
    userId: string(),
    noteName: string().optional().default(""),
    data: object({}).passthrough(),
  }),
});

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "100kb",
    },
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "POST") {
    try {
      const body = JSON.parse(req.body);

      const parsedBody = schema.shape.body.safeParse(body);

      if (!parsedBody.success) {
        log.warn("validation failed for user notes creation");
        return res.status(400).json({ message: "Invalid data" });
      }

      const { userId, data } = parsedBody.data;

      const currentUser = getAuth(req);

      const currentUserData = await getUser(currentUser.userId!);

      if (!currentUserData) {
        log.warn("User not found");
        return res.status(404).json({ message: "User not found" });
      }

      const currentInstitutionId = await getCurrentInstitutionId(
        currentUser.userId!,
      );

      if (!currentInstitutionId) {
        log.warn("User institution not found");
        return res.status(404).json({ message: "User institution not found" });
      }

      if (
        !(await isAdmin({
          userId: currentUser.userId!,
          institutionId: currentInstitutionId,
        }))
      ) {
        log.warn("user is not authroized to create notes");
        res.status(401).json({ message: "Unauthorized" });
        return;
      }

      const userNote = await prisma.userNotes.create({
        data: {
          userId: userId,
          creatorName: currentUserData.name,
          noteName: parsedBody.data.noteName,
          institutionId: currentInstitutionId,
          data,
        },
      });

      log.info("User note created");
      return res.json(userNote);
    } catch (e: any) {
      log.error(e);
      res.status(500).json({ message: e.message });
      throw new Error(
        "Couldn't find user notes or user institution:" + e.message,
      );
    }
  }
}
