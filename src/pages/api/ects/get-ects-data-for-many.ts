import type { NextApiRequest, NextApiResponse } from "next";
import type { GetEctsDataExportForManyArgs } from "@/src/types/ects.types";
import type { HttpError } from "@/src/utils/exceptions/http-error";
import { log } from "@/src/utils/logger/logger";
import {
  generateEctsExportDataForMany,
  validateEctsExportRequest,
} from "../../../server/functions/server-ects";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "POST") {
    const body = JSON.parse(req.body) as GetEctsDataExportForManyArgs;
    log.info("get-ects-data-for-many", body);

    try {
      const { institutionId } = await validateEctsExportRequest(req);
      const url = await generateEctsExportDataForMany(body, institutionId);
      return res.json({ url });
    } catch (e) {
      log.error(e);
      const err = e as HttpError;
      res
        .status(err.status || 500)
        .json({ success: false, message: err.message });
    }
  }
}
