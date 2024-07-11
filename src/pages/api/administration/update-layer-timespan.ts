import { getAuth } from "@clerk/nextjs/server";
import type { NextApiRequest, NextApiResponse } from "next";
import { updateLayerTimeSpan } from "@/src/server/functions/server-administration";
import { isValidCuid } from "@/src/server/functions/server-input";
import { hasRolesWithAccess } from "@/src/server/functions/server-role";
import type { UpdateLayerTimespanArgs } from "@/src/types/server/administration.types";
import { HttpError } from "@/src/utils/exceptions/http-error";
import { log } from "@/src/utils/logger/logger";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    if (req.method === "POST") {
      const data = JSON.parse(req.body) as UpdateLayerTimespanArgs;

      log.info("update-layer-timespan", data);

      const { userId } = getAuth(req);

      if (!isValidCuid(data.layerId))
        throw new HttpError("Invalid layerId", 400);

      if (
        !(await hasRolesWithAccess({
          userId: userId!,
          layerIds: [data.layerId],
          rolesWithAccess: ["admin", "moderator"],
        }))
      ) {
        throw new HttpError("Unauthorized", 401);
      }

      const result = await updateLayerTimeSpan(data);
      res.json(result);
    }
  } catch (e) {
    log.error(e);
    const err = e as HttpError;
    res
      .status(err.status || 500)
      .json({ success: false, message: err.message });
  }
}
