import type { NextApiRequest, NextApiResponse } from "next";
import { storageHandler } from "@/src/server/functions/server-cloudflare/storage-handler";
import {
  runPreRequestChecks,
  withTryCatch,
} from "@/src/server/functions/server-utils";
import type { DeleteMultipleDirectoriesData } from "@/src/types/storage.types";
import { log } from "@/src/utils/logger/logger";

async function handlerLogic(req: NextApiRequest, res: NextApiResponse) {
  const data: DeleteMultipleDirectoriesData = JSON.parse(req.body);
  log.context("Cloudflare delete files", data).cli();
  const result = await runPreRequestChecks(req, res, "DELETE");
  if ("message" in result)
    return res.status(result.status || 400).json({ error: result.message });
  const { userId, institutionId } = result;

  const authorizationParams = {
    userId,
    institutionId,
    urls: data.map((deleteDirectory) => deleteDirectory.url),
  };
  const authorized = await storageHandler.authorize.write(authorizationParams);
  log.context("authorized", { authorized }).cli();
  if (!authorized) return res.status(401).json({ message: "Unauthorized" });

  return res.send(await storageHandler.delete.multipleDirectories(data));
}

export default withTryCatch(handlerLogic);
