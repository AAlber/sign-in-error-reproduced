import { getAuth } from "@clerk/nextjs/server";
import type { NextApiRequest, NextApiResponse } from "next";
import { getChildrenIdsOfLayer } from "@/src/server/functions/server-administration";
import {
  enrichAppointmentsWithOrganizerData,
  getAllAppointmentsUserHasAccessTo,
} from "@/src/server/functions/server-appointment";
import { isValidCuid } from "@/src/server/functions/server-input";
import { hasRolesWithAccess } from "@/src/server/functions/server-role";
import { getCurrentInstitutionId } from "@/src/server/functions/server-user";
import { HttpError } from "@/src/utils/exceptions/http-error";
import { log } from "@/src/utils/logger/logger";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    if (req.method === "GET") {
      const scheduleOfUserId = req.query.userId as string;
      const forWeek = req.query.forWeek as string;
      const filteredLayerIds = req.query.filteredLayerIds as string;

      if (!scheduleOfUserId)
        return res.status(400).json({ message: "No id provided" });

      const institutionId = await getCurrentInstitutionId(scheduleOfUserId);
      if (!institutionId) {
        // user has not joined any institution yet, just return empty array
        return res.json([]);
      }

      const authUser = getAuth(req);
      const authUserId = authUser.userId!;

      if (scheduleOfUserId !== authUserId) {
        const institutionIdOfAuthUser =
          await getCurrentInstitutionId(authUserId);

        if (!institutionIdOfAuthUser)
          throw new HttpError("Not authorized", 403);

        const isAuthorized = await hasRolesWithAccess({
          layerIds: Array.from(
            new Set([institutionIdOfAuthUser, institutionId]),
          ),
          rolesWithAccess: ["admin"],
          userId: authUserId,
        });

        if (!isAuthorized) throw new HttpError("Not authorized", 403);
      }

      const filteredLayers = filteredLayerIds
        ? filteredLayerIds.split(",")
        : [];

      if (filteredLayers.length > 0) {
        const isValid = filteredLayers.every((layerId) => isValidCuid(layerId));
        if (!isValid) throw new HttpError("Invalid filtered layer ids", 400);

        const childrenIdPromise = filteredLayers.map((layerId) =>
          getChildrenIdsOfLayer(layerId),
        );

        const childrenIds = await Promise.all(childrenIdPromise);
        const childrenIdsFlat = childrenIds.flat();
        filteredLayers.push(...childrenIdsFlat);
      }

      if (!forWeek) throw new HttpError("No week provided", 400);

      const days = forWeek.split(",").map((day) => new Date(day));
      const gte = new Date(
        Math.min(
          ...days.map((d) => new Date(d.getTime()).setHours(-24, 0, 0, 0)),
        ),
      );
      const lte = new Date(
        Math.max(
          ...days.map((d) => new Date(d.getTime()).setHours(48, 0, 0, 0)),
        ),
      );

      const appointments = await getAllAppointmentsUserHasAccessTo(
        scheduleOfUserId,
        institutionId,
        gte,
        lte,
        filteredLayers,
      );

      const appointmentsWithOrganizerData =
        await enrichAppointmentsWithOrganizerData(appointments, institutionId);

      return res.json(appointmentsWithOrganizerData);
    }
  } catch (e) {
    log.error(e);
    const err = e as HttpError;
    res
      .status(err.status ?? 500)
      .json({ success: false, message: err.message });
  }
}
