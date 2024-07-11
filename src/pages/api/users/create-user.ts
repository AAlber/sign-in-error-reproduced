// import { type User } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../server/db/client";
import { isValidUserId } from "../../../server/functions/server-input";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "POST") {
    const data = JSON.parse(req.body);

    if (req.headers.authorization !== "Bearer " + process.env.FUXAM_SECRET)
      return res.status(401).json({ message: "Unauthorized" });

    if (data.id) {
      if (!isValidUserId(data.id)) {
        res.status(400).json({ message: "Invalid user id" });
        return;
      }
    }

    const user = await prisma.user.upsert({
      where: {
        email: data.email,
      },
      update: {
        currentInstitution: data.currentInstitution,
      },
      create: {
        id: data.id,
        name: data.name,
        email: data.email,
        currentInstitution: data.currentInstitution,
      },
    });

    return res.json(user);
  }
}
