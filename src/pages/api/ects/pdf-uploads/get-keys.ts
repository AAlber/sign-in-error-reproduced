import { getAuth } from "@clerk/nextjs/server";
import type { NextApiRequest, NextApiResponse } from "next";
import { getUploadedPdfKeys } from "@/src/server/functions/server-ects/ects-document-functions";
import { isAdmin } from "@/src/server/functions/server-role";
import { getCurrentInstitutionId } from "@/src/server/functions/server-user";
import type { HttpError } from "@/src/utils/exceptions/http-error";
import { log } from "@/src/utils/logger/logger";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "GET") {
    const { userId } = getAuth(req);

    const institutionId = await getCurrentInstitutionId(userId!);
    if (!institutionId) {
      return res.status(400).json({ message: "No institution selected" });
    }

    const hasPermission = await isAdmin({ userId: userId!, institutionId });
    if (!hasPermission) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const data = await getUploadedPdfKeys(institutionId);
      return res.json(data);
    } catch (e) {
      log.error(e);
      const err = e as HttpError;
      res
        .status(err.status || 500)
        .json({ success: false, message: err.message });
    }
  }
}
