import { getAuth } from "@clerk/nextjs/server";
import type { NextApiRequest, NextApiResponse } from "next";
import {
  getAppointment,
  getLayerIdsOfAppointment,
  isOnlineAppointmentHappeningSoonOrNow,
} from "@/src/server/functions/server-appointment";
import {
  isAppointmentCreatorOrganizerorAttendee,
  updateAppointmentAttendenceLogWithFirstAttendedTimestamp,
} from "@/src/server/functions/server-appointment-attendence";
import { hasRolesInAtLeastOneLayer } from "@/src/server/functions/server-role";
import { getCurrentInstitutionId } from "@/src/server/functions/server-user";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "POST") {
    const data = JSON.parse(req.body) as {
      appointmentId: string;
    };

    if (!data.appointmentId) {
      res.status(400).json({ message: "Invalid data" });
      return;
    }

    const { userId } = getAuth(req);
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const layerIds = await getLayerIdsOfAppointment(data.appointmentId);
    if (!layerIds) return res.status(404).json({ message: "Layers not found" });

    const appointment = await getAppointment(data.appointmentId);
    if (!appointment)
      return res.status(404).json({ message: "Appointment not found" });

    const institutionId = await getCurrentInstitutionId(userId);
    if (!institutionId)
      return res.status(400).json({ message: "No institution id found" });

    const hasAccess = await hasRolesInAtLeastOneLayer({
      userId: userId!,
      layerIds: layerIds,
      rolesWithAccess: ["admin", "moderator", "educator", "member"],
    });

    const isUserCreatorOrOrganizerOrAttendee =
      await isAppointmentCreatorOrganizerorAttendee(
        data.appointmentId,
        userId,
        institutionId,
      );

    if (!hasAccess && !isUserCreatorOrOrganizerOrAttendee)
      return res.status(401).json({ message: "No access" });

    const checkInAvailable = await isOnlineAppointmentHappeningSoonOrNow(
      data.appointmentId,
    );
    if (!checkInAvailable)
      return res.status(400).json({ message: "Check-in not available" });

    await updateAppointmentAttendenceLogWithFirstAttendedTimestamp(
      userId!,
      data.appointmentId,
      true,
      true,
    );
    return res.json({ message: "Checked-in successfully", success: true });
  }
}
