import type { NextApiRequest, NextApiResponse } from "next";
import { storageHandler } from "@/src/server/functions/server-cloudflare/storage-handler";
import {
  runPreRequestChecks,
  withTryCatch,
} from "@/src/server/functions/server-utils";
import type { FileUploadPathData } from "@/src/types/storage.types";
import { log } from "@/src/utils/logger/logger";

async function handlerLogic(req: NextApiRequest, res: NextApiResponse) {
  const data: FileUploadPathData = JSON.parse(req.query.data as string);
  const result = await runPreRequestChecks(req, res, "GET");
  log.info("Getting institution storage overview").cli();
  if ("message" in result)
    return res.status(result.status || 400).json({ error: result.message });
  const { institutionId } = result;

  return res.json(
    await storageHandler.get.storageCategories(data, institutionId),
  );
}

export default withTryCatch(handlerLogic);
