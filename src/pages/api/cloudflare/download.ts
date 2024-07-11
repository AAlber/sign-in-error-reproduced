import type { NextApiRequest, NextApiResponse } from "next";
import { storageHandler } from "@/src/server/functions/server-cloudflare/storage-handler";
import {
  runPreRequestChecks,
  withTryCatch,
} from "@/src/server/functions/server-utils";
import { log } from "@/src/utils/logger/logger";

async function handlerLogic(req: NextApiRequest, res: NextApiResponse) {
  const url = req.query.url as string;
  log.info("Downloading url", url).cli();
  const result = await runPreRequestChecks(req, res, "GET");
  if ("message" in result)
    return res.status(result.status || 400).json({ error: result.message });
  const { userId, institutionId } = result;

  const key = decodeURIComponent(
    url.replace(process.env.NEXT_PUBLIC_WORKER_URL! + "/", ""),
  );

  log.info("key", key).cli();
  const authorized = await storageHandler.authorize.read({
    userId,
    institutionId,
    key,
  });
  if (!authorized) {
    log.error("Unauthorized");
    return res.status(401).json({ message: "Unauthorized" });
  }
  log.info("Fetching file");

  const signedUrl = await storageHandler.get.signedGetUrl(key);

  if (!signedUrl) {
    log.error("Failed to get presigned url", decodeURI(url));
    return res.json({ error: "Failed to get presigned url" });
  }

  return res.json({
    signedUrl,
  });
}

export default withTryCatch(handlerLogic);
