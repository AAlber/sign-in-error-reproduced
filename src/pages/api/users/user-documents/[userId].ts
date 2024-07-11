import { getAuth } from "@clerk/nextjs/server";
import * as Sentry from "@sentry/nextjs";
import type { NextApiRequest, NextApiResponse } from "next";
import { storageHandler } from "@/src/server/functions/server-cloudflare/storage-handler";
import { isAdmin } from "@/src/server/functions/server-role";
import { getCurrentInstitutionId } from "@/src/server/functions/server-user";
import { HttpError } from "@/src/utils/exceptions/http-error";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  console.log("request arrived");
  if (req.method === "GET") {
    try {
      const { userId } = getAuth(req);

      const institutionId = await getCurrentInstitutionId(userId!);
      if (!institutionId)
        throw new HttpError("User is not part of an institution", 404);
      const userIdToGet = req.query.userId as string;

      const [files, authorized] = await Promise.all([
        storageHandler.list.r2Objects(
          "institutions/" +
            institutionId +
            "/user/" +
            userIdToGet +
            "/user-documents",
        ),
        isAdmin({
          userId: userId!,
          institutionId,
        }),
      ]);
      if (!authorized)
        throw new HttpError("Unauthorized to see user documents", 403);
      return res.json(files?.r2Objects);
    } catch (e) {
      const err = e as HttpError;
      Sentry.captureException(err);
      res.status(err.status ?? 500).json({ error: err.message });
    }
  }
}
