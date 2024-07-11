import { getAuth } from "@clerk/nextjs/server";
import type { NextApiRequest, NextApiResponse } from "next";
import { object, string } from "zod";
import { prisma } from "@/src/server/db/client";
import { isAdmin } from "@/src/server/functions/server-role";
import { getCurrentInstitutionId } from "@/src/server/functions/server-user";
import { log } from "@/src/utils/logger/logger";

const schema = object({
  query: object({ noteId: string() }),
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
  if (req.method === "DELETE") {
    try {
      const parsedQuery = schema.shape.query.safeParse(req.query);

      if (!parsedQuery.success) {
        log.warn("validation failed for user notes deletion");
        return res.status(400).json({ message: "Invalid data" });
      }

      const { noteId } = parsedQuery.data;

      const currentUser = getAuth(req);

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
        log.warn(" user is not authorized to delete user notes");
        res.status(401).json({ message: "Unauthorized" });
        return;
      }

      const deleteUserNote = await prisma.userNotes.delete({
        where: {
          id: noteId,
        },
      });

      log.info("User note deleted");
      return res.json(deleteUserNote);
    } catch (e: any) {
      log.error(e);
      res.status(500).json({ message: e.message });
      throw new Error(
        "Couldn't find user notes or user institution:" + e.message,
      );
    }
  }
}
