import { getAuth } from "@clerk/nextjs/server";
import type { AppointmentAttendanceKeyValidityEnum } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/src/server/db/client";
import { getLayerIdsOfAppointment } from "@/src/server/functions/server-appointment";
import { isAppointmentCreatorOrOrganizer } from "@/src/server/functions/server-appointment-attendence";
import { hasRolesInAtLeastOneLayer } from "@/src/server/functions/server-role";
import { respondToPreflightRequest } from "@/src/utils/utils";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "OPTIONS") return respondToPreflightRequest(req, res);
  if (req.method === "POST") {
    const data = JSON.parse(req.body) as {
      appointmentId: string;
      validity: AppointmentAttendanceKeyValidityEnum;
    };

    if (!data.appointmentId || !data.validity) {
      res.status(400).json({ message: "Invalid data" });
      return;
    }

    const { userId } = getAuth(req);
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const layerIds = await getLayerIdsOfAppointment(data.appointmentId);

    if (!layerIds) return res.status(404).json({ message: "Layers not found" });

    const hasAccess = await hasRolesInAtLeastOneLayer({
      userId,
      layerIds: layerIds,
      rolesWithAccess: ["admin", "moderator", "educator"],
    });

    const userIsCreatorOrOrganizer = await isAppointmentCreatorOrOrganizer(
      data.appointmentId,
      userId,
    );

    if (!hasAccess && !userIsCreatorOrOrganizer)
      return res.status(401).json({ message: "No access" });

    const update = await prisma.appointmentAttendenceKey.update({
      where: {
        appointmentId: data.appointmentId,
      },
      data: {
        validity: data.validity,
      },
    });

    return res.json(update);
  }
}
