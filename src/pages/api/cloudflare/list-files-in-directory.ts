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

  log.context("Cloudflare list directories", data).cli();
  const result = await runPreRequestChecks(req, res, "GET");
  if ("message" in result)
    return res.status(result.status || 400).json({ error: result.message });
  const { userId, institutionId } = result;

  const key = storageHandler.create.listPath({ data, userId, institutionId });

  log.context("Key", { key }).cli();
  //TODO: IMPROVE THIS SINCE ITS A GET REQUEST
  const authorized = await storageHandler.authorize.read({
    userId,
    institutionId,
    key,
  });
  if (!authorized) {
    log.error("Unauthorized").cli();
    return res.status(401).json({ message: "Unauthorized" });
  }

  return res.json(await storageHandler.list.r2Objects(key));
}

export default withTryCatch(handlerLogic);
