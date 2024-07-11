import { getAuth } from "@clerk/nextjs/server";
import type { NextApiRequest, NextApiResponse } from "next";
import { storageHandler } from "@/src/server/functions/server-cloudflare/storage-handler";
import { deleteInstitutionECTSpdf } from "@/src/server/functions/server-ects/ects-document-functions";
import { getCurrentInstitutionId } from "@/src/server/functions/server-user";
import type { HttpError } from "@/src/utils/exceptions/http-error";
import { log } from "@/src/utils/logger/logger";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "DELETE") {
    const { userId } = getAuth(req);

    const institutionId = await getCurrentInstitutionId(userId!);
    if (!institutionId) {
      return res.status(400).json({ message: "No institution selected" });
    }

    try {
      const { url } = JSON.parse(req.body) as { url: string };

      const authorized = await storageHandler.authorize.write({
        institutionId,
        userId: userId!,
        urls: [url],
      });
      if (!authorized) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const result = await deleteInstitutionECTSpdf(institutionId, url);
      return res.json(result);
    } catch (e) {
      log.error(e);
      const err = e as HttpError;
      res
        .status(err.status || 500)
        .json({ success: false, message: err.message });
    }
  }
}
