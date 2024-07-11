import { getAuth } from "@clerk/nextjs/server";
import type { NextApiRequest, NextApiResponse } from "next";
import {
  getUsersAndDataFieldsOfInstitution,
  isAdmin,
} from "@/src/server/functions/server-role";
import { getCurrentInstitutionId } from "@/src/server/functions/server-user";
import { sentry } from "@/src/server/singletons/sentry";
import type { InstitutionUserManagementFilter } from "@/src/types/user-management.types";
import { HttpError } from "@/src/utils/exceptions/http-error";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    if (req.method === "GET") {
      const filter = req.query as Partial<InstitutionUserManagementFilter>;

      const { userId } = getAuth(req);
      if (!userId) throw new HttpError("No userId provided", 403);

      const institutionId = await getCurrentInstitutionId(userId);
      if (!institutionId) throw new HttpError("No institutionId found");

      const hasAccess = await isAdmin({ userId: userId, institutionId });
      if (!hasAccess) throw new HttpError("Unauthorized", 401);

      const users = await getUsersAndDataFieldsOfInstitution(
        institutionId,
        filter,
      );

      return res.json(users);
    }
  } catch (e) {
    sentry.captureException(e);
    const err = e as HttpError;
    res.status(err.status ?? 500).json({ message: err.message });
  }
}
