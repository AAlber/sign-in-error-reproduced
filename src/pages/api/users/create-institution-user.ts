import { getAuth } from "@clerk/nextjs/server";
import * as Sentry from "@sentry/nextjs";
import type { NextApiRequest, NextApiResponse } from "next";
import { hasRolesWithAccess } from "@/src/server/functions/server-role";
import { getCurrentInstitutionId } from "@/src/server/functions/server-user";
import { createInstitutionUser } from "@/src/server/functions/server-user-mgmt";
import type {
  CreateInstitutionUser,
  InstitutionUserManagementUser,
} from "@/src/types/user-management.types";
import { HttpError } from "@/src/utils/exceptions/http-error";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "POST") {
    try {
      const { userId } = getAuth(req);
      const userData = JSON.parse(req.body) as CreateInstitutionUser;
      if (!userData.name || !userData.email)
        throw new HttpError("Missing Data", 400);

      const currentInstitutionId = await getCurrentInstitutionId(userId!);
      if (!currentInstitutionId)
        throw new HttpError("User is not part of an institution", 404);

      const hasAccess = await hasRolesWithAccess({
        userId: userId!,
        layerIds: userData.giveAccessToLayer
          ? [currentInstitutionId, userData.giveAccessToLayer]
          : [currentInstitutionId],
        rolesWithAccess: ["admin", "moderator"],
      });

      if (!hasAccess)
        throw new HttpError(
          "Unauthorized to give access to this layer or institution",
          403,
        );

      const user = await createInstitutionUser(userData, currentInstitutionId);
      res.json({
        ...user,
        image: null,
        accessLevel: "access",
        accessState: "inactive",
        invite: null,
        role: "member",
        fieldData: [],
      } satisfies InstitutionUserManagementUser);
    } catch (e) {
      const err = e as HttpError;
      Sentry.captureException(err);
      res.status(err.status ?? 500).json({ error: err.message });
    }
  }
}
