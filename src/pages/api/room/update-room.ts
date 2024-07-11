import { getAuth } from "@clerk/nextjs/server";
import type { NextApiRequest, NextApiResponse } from "next";
import { updateInstitutionRoom } from "@/src/server/functions/server-institution-room";
import { isValidCuid } from "../../../server/functions/server-input";
import { isAdmin } from "../../../server/functions/server-role";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "POST") {
    const data = JSON.parse(req.body);
    const { userId } = getAuth(req);

    if (
      !data.id ||
      !data.institutionId ||
      !data.personCapacity ||
      !data.address ||
      !data.name
    ) {
      res.status(400).json({ message: "Invalid data" });
      return;
    }

    if (data.name.length > 300)
      return res.status(400).json({ message: "Name too long" });

    if (!isValidCuid(data.id)) {
      res.status(400).json({ message: "Invalid id" });
      return;
    }

    if (!isValidCuid(data.institutionId)) {
      res.status(400).json({ message: "Invalid institution id" });
      return;
    }

    if (
      !(await isAdmin({ userId: userId!, institutionId: data.institutionId }))
    ) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const request = await updateInstitutionRoom(
      data.id,
      data.name,
      data.institutionId,
      data.personCapacity,
      data.address,
      data.addressNotes || "",
      data.amenities || "",
    );
    return res.json(request);
  }
}
