import { getAuth } from "@clerk/nextjs/server";
import type { NextApiRequest, NextApiResponse } from "next";
import { getChildrenIdsOfLayer } from "@/src/server/functions/server-administration";
import {
  enrichAppointmentsWithOrganizerData,
  searchAllAppointmentsUserHasAccessTo,
} from "@/src/server/functions/server-appointment";
import { isValidCuid } from "@/src/server/functions/server-input";
import { getCurrentInstitutionId } from "@/src/server/functions/server-user";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "GET") {
    const { userId } = getAuth(req);

    if (!userId) return res.status(401).json({ message: "Unautorhized" });

    const filteredLayerIds = req.query.filteredLayerIds as string;
    const filteredLayers = filteredLayerIds ? filteredLayerIds.split(",") : [];
    if (filteredLayers.length > 0) {
      const isValid = filteredLayers.every((layerId) => isValidCuid(layerId));
      if (!isValid)
        return res.status(400).json({ message: "Invalid filtered layer ids" });
    }

    const searchTerm = req.query.searchTerm as string;
    if (!searchTerm)
      return res.status(400).json({ message: "No search term provided" });

    const childrenIdPromise = filteredLayers.map((layerId) =>
      getChildrenIdsOfLayer(layerId),
    );

    const childrenIds = await Promise.all(childrenIdPromise);
    const childrenIdsFlat = childrenIds.flat();
    filteredLayers.push(...childrenIdsFlat);

    const institutionId = await getCurrentInstitutionId(userId);
    if (!institutionId)
      return res.status(400).json({ message: "No institution id found" });

    // Pagination params
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const { data: appointments, totalCount } =
      await searchAllAppointmentsUserHasAccessTo(
        userId,
        institutionId,
        searchTerm,
        filteredLayers,
        skip,
        limit,
      );

    const totalPages = Math.ceil(totalCount / limit);

    res.setHeader(
      "Cache-Control",
      "max-age=0, s-maxage=1, stale-while-revalidate",
    );

    const appointmentsWithOrganizerData =
      await enrichAppointmentsWithOrganizerData(appointments, institutionId);

    return res.json({
      appointments: appointmentsWithOrganizerData,
      pagination: {
        totalItems: totalCount,
        totalPages: totalPages,
        currentPage: page,
        itemsPerPage: limit,
      },
    });
  }
}
