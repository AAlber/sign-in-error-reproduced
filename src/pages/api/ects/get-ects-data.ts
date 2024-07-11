import type { NextApiRequest, NextApiResponse } from "next";
import type { GetEctsDataExportArgs } from "@/src/types/ects.types";
import type { HttpError } from "@/src/utils/exceptions/http-error";
import { log } from "@/src/utils/logger/logger";
import {
  generateEctsExportData,
  validateEctsExportRequest,
} from "../../../server/functions/server-ects";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "POST") {
    const body = JSON.parse(req.body) as GetEctsDataExportArgs;
    log.info("get-ects-data", body);

    if (!body.userId || !body.type) {
      return res.status(400).json({ message: "Invalid data" });
    }

    try {
      const { institutionId } = await validateEctsExportRequest(req);
      const url = await generateEctsExportData(body, institutionId);

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
