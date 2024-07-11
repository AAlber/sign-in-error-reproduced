import { getAuth } from "@clerk/nextjs/server";
import type { NextApiRequest, NextApiResponse } from "next";
import { getChildrenIdsOfLayer } from "@/src/server/functions/server-administration";
import { getCurrentInstitutionId } from "@/src/server/functions/server-user";
import { respondToPreflightRequest } from "@/src/utils/utils";
import {
  enrichAppointmentsWithOrganizerData,
  getAllAppointmentsUserHasAccessTo,
} from "../../../server/functions/server-appointment";
import { isValidCuid } from "../../../server/functions/server-input";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "OPTIONS") return respondToPreflightRequest(req, res);
  if (req.method === "GET") {
    const userId = req.query.userId as string;
    if (!userId) return res.status(400).json({ message: "No id provided" });

    const { userId: authUserId } = getAuth(req);

    if (userId !== authUserId)
      return res.status(403).json({ message: "Not authorized" });

    const forDay = req.query.forDay as string;
    if (!forDay) return res.status(400).json({ message: "No day provided" });

    const filteredLayerIds = req.query.filteredLayerIds as string;
    const filteredLayers = filteredLayerIds ? filteredLayerIds.split(",") : [];
    if (filteredLayers.length > 0) {
      const isValid = filteredLayers.every((layerId) => isValidCuid(layerId));
      if (!isValid)
        return res.status(400).json({ message: "Invalid filtered layer ids" });
    }

    const childrenIdPromise = filteredLayers.map((layerId) =>
      getChildrenIdsOfLayer(layerId),
    );

    const childrenIds = await Promise.all(childrenIdPromise);
    const childrenIdsFlat = childrenIds.flat();
    filteredLayers.push(...childrenIdsFlat);
    const day = new Date(forDay);

    const institutionId = await getCurrentInstitutionId(userId!);
    if (!institutionId)
      return res.status(400).json({ message: "No institution id found" });

    const appointments = await getAllAppointmentsUserHasAccessTo(
      userId!,
      institutionId,
      new Date(new Date(day.getTime()).setHours(-24, 0, 0, 0)),
      new Date(new Date(day.getTime()).setHours(48, 0, 0, 0)),
      filteredLayers,
    );

    const appointmentsWithOrganizerData =
      await enrichAppointmentsWithOrganizerData(appointments, institutionId);

    return res.json(appointmentsWithOrganizerData);
  }
}
