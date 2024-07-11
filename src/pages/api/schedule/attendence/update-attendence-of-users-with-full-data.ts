import { getAuth } from "@clerk/nextjs/server";
import type { NextApiRequest, NextApiResponse } from "next";
import type { MemberWithAttendence } from "@/src/client-functions/client-appointment-attendence";
import { getLayerIdsOfAppointment } from "@/src/server/functions/server-appointment";
import {
  isAppointmentCreatorOrOrganizer,
  updateAppointmentAttendenceLog,
} from "@/src/server/functions/server-appointment-attendence";
import { hasRolesInAtLeastOneLayer } from "@/src/server/functions/server-role";
import { log } from "@/src/utils/logger/logger";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "PUT") {
    log.info(
      "API /schedule/attendence/update-attendence-of-users-with-full-data",
    );
    const apiData = JSON.parse(req.body) as {
      appointmentId: string;
      data: MemberWithAttendence[];
    };

    if (!apiData.appointmentId || !apiData.data) {
      log.error("Invalid data");
      res.status(400).json({ message: "Invalid data" });
      return;
    }

    const { userId } = getAuth(req);
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const layerIds = await getLayerIdsOfAppointment(apiData.appointmentId);

    if (!layerIds) {
      log.error("Layers not found");
      return res.status(404).json({ message: "Layers not found" });
    }

    const hasAccess = await hasRolesInAtLeastOneLayer({
      userId: userId!,
      layerIds: layerIds,
      rolesWithAccess: ["admin", "moderator", "educator"],
    });

    const userIsCreatorOrOrganizer = await isAppointmentCreatorOrOrganizer(
      apiData.appointmentId,
      userId,
    );

    if (!hasAccess && !userIsCreatorOrOrganizer) {
      log.error("No access");
      return res.status(401).json({ message: "No access" });
    }

    log.info("Updating attendence of users");
    const updatePromises = apiData.data.map((member) =>
      updateAppointmentAttendenceLog(
        member.id,
        apiData.appointmentId,
        member.attended,
        member.attendingType === "online",
      ),
    );

    const update = await Promise.all(updatePromises);
    return res.json({ message: "Updated attendence of users", data: update });
  }
}
