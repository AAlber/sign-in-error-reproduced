import { getAuth } from "@clerk/nextjs/server";
import * as Sentry from "@sentry/nextjs";
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/src/server/db/client";
import {
  getSimpleLayer,
  isAncestorOfLayer,
  updateLayerRoles,
} from "@/src/server/functions/server-administration";
import { isAdminOrModerator } from "@/src/server/functions/server-role";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const body = JSON.parse(req.body) as ReorderLayerPositionArgs;

  const { userId } = getAuth(req);
  const { layerId, parentId: parent_id, children } = body;

  /**
   * 1. Validate args and layers
   * 2. check if parentId is course
   * 3. check permissions
   */

  try {
    if (
      !userId ||
      !layerId ||
      !parent_id ||
      !children?.length ||
      req.method !== "POST"
    ) {
      return res.status(401).send("INVALID REQUEST");
    }

    const [
      layerToUpdate,
      parent,
      isAncestor,
      isAuthorizedLayer,
      isAuthorizedParent,
    ] = await Promise.all([
      getSimpleLayer(layerId, true),
      /** the new parent of the layer */
      getSimpleLayer(parent_id, true),
      isAncestorOfLayer(layerId, parent_id),
      isAdminOrModerator({ userId, layerId }),
      isAdminOrModerator({ userId, layerId: parent_id }),
    ]);

    if (!isAuthorizedLayer || !isAuthorizedParent)
      return res
        .status(401)
        .json(
          "You do not have the permissions to move the selected layer into that parent layer",
        );

    if (!layerToUpdate || !parent || isAncestor || parent?.isCourse)
      return res.status(403).send("INVALID REQUEST");

    await prisma.$transaction(
      async (tx) => {
        // Update new parent of the layer
        const updateParent = tx.layer.update({
          where: { id: layerId },
          data: { parent_id },
        });

        // Update position of the children
        const promises = children.map((child, idx) => {
          return tx.layer.update({
            where: { id: child },
            data: {
              position: idx,
            },
          });
        });

        return await Promise.all([
          updateParent,
          // only update layer roles when parentId is changed
          ...(layerToUpdate.parent_id !== parent_id
            ? [updateLayerRoles(layerId, parent_id)]
            : []),
          ...promises,
        ]);
      },
      { maxWait: 15000, timeout: 15000 },
    );

    return res.json({ success: true });
  } catch (e) {
    const err = e as Error;
    Sentry.captureException(err);
    return res.status(500).json(err.message);
  }
}

export type ReorderLayerPositionArgs = {
  /** The layerId being dragged */
  layerId: string;
  /**
   * The new parent of the layer being moved, can be the `institutionId` if
   * layer is being dragged into root
   *
   * TODO: casing for consistency (parentId -> parent_id)
   */
  parentId: string;
  /** Children of the parentId, we use this to update the `position` value of the children */
  children: string[];
};
