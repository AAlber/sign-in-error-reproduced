import { getAuth } from "@clerk/nextjs/server";
import * as Sentry from "@sentry/nextjs";
import type { NextApiRequest, NextApiResponse } from "next";
import {
  getChildrenIdsOfLayer,
  temporarilyDeleteLayers,
} from "@/src/server/functions/server-administration";
import { deleteLobbies } from "@/src/server/functions/server-chat";
import { getCurrentInstitutionId } from "@/src/server/functions/server-user";
import { isValidCuid } from "../../../server/functions/server-input";
import { hasRolesWithAccess } from "../../../server/functions/server-role";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "POST") {
    const data = JSON.parse(req.body) as { layerId: string };
    const { userId } = getAuth(req);

    if (!isValidCuid(data.layerId)) {
      res.status(400).json({ message: "Invalid layer id" });
      return;
    }
    if (
      !(await hasRolesWithAccess({
        userId: userId!,
        layerIds: [data.layerId],
        rolesWithAccess: ["admin", "moderator"],
      }))
    ) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const [ids, institutionId] = await Promise.all([
      getChildrenIdsOfLayer(data.layerId),
      getCurrentInstitutionId(userId!),
    ]);

    if (!institutionId)
      return res.status(400).json({ message: "No institution id" });
    if (ids.length === 0) return res.json({ success: true, message: "No ids" });
    try {
      const result = await temporarilyDeleteLayers({
        layerId: data.layerId,
        childrenIds: ids,
        institutionId,
      });
      deleteLobbies(ids).catch((e) => {
        console.log("getstream-chat: Delete lobbies error: ", e);
      });

      res.json({ success: result });
    } catch (e) {
      const err = e as Error;
      Sentry.captureException(err, { extra: { layerId: data.layerId } });
      res.status(500).json({ success: false, message: err.message });
    }
  }
}
