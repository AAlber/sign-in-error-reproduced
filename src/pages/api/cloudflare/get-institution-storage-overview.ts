import type { NextApiRequest, NextApiResponse } from "next";
import { storageHandler } from "@/src/server/functions/server-cloudflare/storage-handler";
import { getHighestRoleOfUser } from "@/src/server/functions/server-role";
import {
  runPreRequestChecks,
  withTryCatch,
} from "@/src/server/functions/server-utils";
import { log } from "@/src/utils/logger/logger";

async function handlerLogic(req: NextApiRequest, res: NextApiResponse) {
  const result = await runPreRequestChecks(req, res);
  log.info("Getting institution storage overview").cli();
  if ("message" in result)
    return res.status(result.status || 400).json({ error: result.message });
  const { userId, institutionId } = result;

  const highestRole = await getHighestRoleOfUser(userId, institutionId);
  log.info("Highest role", highestRole).cli();
  if (highestRole !== "admin" && highestRole !== "moderator") {
    log.error("Unauthorized").cli();
    return res.status(401).json({ message: "Unauthorized" });
  }
  return res.json(await storageHandler.list.layerSizes(institutionId));
}

export default withTryCatch(handlerLogic);
