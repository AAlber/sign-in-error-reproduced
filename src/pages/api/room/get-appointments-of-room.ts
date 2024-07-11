import { getAuth } from "@clerk/nextjs/server";
import type { NextApiRequest, NextApiResponse } from "next";
import { getAppointmentsOfRoom } from "@/src/server/functions/server-appointment";
import { isAdmin } from "@/src/server/functions/server-role";
import { getCurrentInstitutionId } from "@/src/server/functions/server-user";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "GET") {
    const roomId = req.query.roomId as string;
    const date = req.query.date as string;
    if (!roomId) return res.status(400).json({ message: "No roomId provided" });
    if (!date) return res.status(400).json({ message: "No date provided" });

    const { userId } = getAuth(req);
    const institutionId = await getCurrentInstitutionId(userId!);
    if (!institutionId)
      return res.status(400).json({ message: "No institutionId found" });

    const hasAccess = await isAdmin({ userId: userId!, institutionId });
    if (!hasAccess) return res.status(401).json({ message: "Unauthorized" });

    const appointments = await getAppointmentsOfRoom(roomId, date);
    res.json(appointments);
  }
}
