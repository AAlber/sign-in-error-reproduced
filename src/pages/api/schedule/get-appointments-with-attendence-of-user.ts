import { getAuth } from "@clerk/nextjs/server";
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/src/server/db/client";
import { log } from "@/src/utils/logger/logger";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Record<string, boolean> | { message: string }>,
) {
  if (req.method === "GET") {
    const { appointmentIds: appointmentIdsString } = req.query as {
      appointmentIds: string;
    };
    const { userId } = getAuth(req);

    log.context("get-appointments-with-attendence-of-user", {
      userId,
      appointmentIdsString,
    });

    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    if (!appointmentIdsString)
      return res.status(400).json({ message: "No appointment ids provided" });

    const appointmentIds = appointmentIdsString.split(",");

    if (!Array.isArray(appointmentIds))
      return res.status(400).json({ message: "Invalid appointment ids" });

    if (appointmentIds.length === 0) return res.json({});

    log.info("Checking if the user has attended the appointments");
    const appointmentsWithAttendence =
      await prisma.appointmentAttendenceLog.findMany({
        where: {
          appointmentId: {
            in: appointmentIds,
          },
          userId,
        },
        select: {
          appointmentId: true,
          attended: true,
        },
      });

    log.info("Returning the appointments with attendence");

    const appointmentsWithAttendenceMap = appointmentsWithAttendence.reduce<
      Record<string, boolean>
    >((acc, { appointmentId, attended }) => {
      acc[appointmentId] = attended;
      return acc;
    }, {});

    log.info(
      "Returning the appointments with attendence",
      appointmentsWithAttendenceMap,
    );
    return res.json(appointmentsWithAttendenceMap);
  }
}
