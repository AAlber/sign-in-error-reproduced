import { getAuth } from "@clerk/nextjs/server";
import type { NextApiRequest, NextApiResponse } from "next";
import { excludeLinkCoursesFromLayerIds } from "@/src/server/functions/server-administration";
import { getLayersUserHasSpecialAccessTo } from "@/src/server/functions/server-user";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "GET") {
    const { userId } = getAuth(req);
    const includeLinkedCourses = req.query.includeLinkedCourses as string;
    let layers = await getLayersUserHasSpecialAccessTo(userId!);

    if (
      typeof includeLinkedCourses !== "undefined" &&
      includeLinkedCourses === "false"
    ) {
      const idsWithoutLinkedCourses = await excludeLinkCoursesFromLayerIds(
        layers.map((layer) => layer.id),
        { id: true },
      );

      const ids = idsWithoutLinkedCourses.map((i) => i.id);
      layers = layers.filter((l) => ids.includes(l.id));
    }

    res.json(layers);
  }
}
