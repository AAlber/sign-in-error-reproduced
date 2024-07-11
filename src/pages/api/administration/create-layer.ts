import { getAuth } from "@clerk/nextjs/server";
import type { NextApiRequest, NextApiResponse } from "next";
import {
  createLayerOrCourseAndPropagateRoles,
  createLinkedCourse,
} from "@/src/server/functions/server-administration";
import { isAdminModeratorOrEducator } from "@/src/server/functions/server-role";
import type { CreateLayerApiArgs } from "@/src/types/server/administration.types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "POST") {
    try {
      const body = JSON.parse(req.body) as CreateLayerApiArgs;
      const { name, isCourse } = body;
      const parentId = body["parent_id"];
      const institutionId = body["institution_id"];
      const layerId = body.id;

      if (!layerId) throw new Error("Missing LayerId");

      const { userId } = getAuth(req);

      if (
        !(await isAdminModeratorOrEducator({
          userId: userId!,
          layerId: parentId,
        }))
      ) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }

      if (!!isCourse && !!body.isLinkedCourse) {
        const resolvedLayer = await createLinkedCourse(
          layerId,
          body.linkedCourseLayerId,
          parentId,
          institutionId,
        );
        return res.json(resolvedLayer);
      }

      const layerAndCourse = await createLayerOrCourseAndPropagateRoles({
        id: layerId,
        name,
        institutionId,
        isCourse,
        parentId,
        userId: userId!,
      });

      return res.json(layerAndCourse);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
}
