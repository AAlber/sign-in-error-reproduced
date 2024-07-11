import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/src/server/db/client";
import type { CreateInstitutionData } from "./create-institution";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "POST") {
    const { institutionId } = JSON.parse(req.body) as CreateInstitutionData;
    const institution = await prisma.institution.findUnique({
      where: {
        id: institutionId,
      },
      include: {
        metadata: true,
        roles: true,
      },
    });
    if (!institution)
      return res.status(400).json({ message: "No institution found" });
    if (institution.roles.length === 0) {
      await prisma.institution.delete({
        where: {
          id: institutionId,
        },
      });
      return res.status(200).json({ message: "Institution deleted" });
    }
    return res.status(400).json({ message: "Institution has users" });
  }
}
