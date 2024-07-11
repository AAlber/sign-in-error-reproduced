import { getAuth } from "@clerk/nextjs/server";
import type { NextApiRequest, NextApiResponse } from "next";
import { importUsersSchema } from "@/src/components/institution-user-management/data-table/toolbar/import-users/schema";
import { prisma } from "@/src/server/db/client";
import { setInstitutionUserDataFieldValues } from "@/src/server/functions/server-institution-user-data-field";
import { addUsersToInstitutionUserGroup } from "@/src/server/functions/server-institution-user-group";
import { hasRolesWithAccess } from "@/src/server/functions/server-role";
import { getCurrentInstitutionId } from "@/src/server/functions/server-user";
import { createManyInstitutionUsers } from "@/src/server/functions/server-user-mgmt";
import { sentry } from "@/src/server/singletons/sentry";
import type { InstitutionUserDataFieldValue } from "@/src/types/institution-user-data-field.types";
import type {
  FieldIdToEmailsWithValueMapping,
  GroupIdToEmailIdsMapping,
  ImportUserArgs,
} from "@/src/types/user-management.types";
import { HttpError } from "@/src/utils/exceptions/http-error";
import { filterUndefined } from "@/src/utils/utils";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    sentry.addBreadcrumb({ message: "Starting users import" });

    const { userId } = getAuth(req);
    if (!userId) throw new HttpError("Forbidden", 403);

    const institutionId = await getCurrentInstitutionId(userId);
    if (!institutionId) throw new HttpError("Institution not found", 404);

    if (
      !(await hasRolesWithAccess({
        layerIds: [institutionId],
        userId,
        rolesWithAccess: ["admin"],
      }))
    )
      throw new HttpError("No access", 403);

    const body = JSON.parse(req.body) as ImportUserArgs;
    const parsedBody = importUsersSchema.parse(body.users);

    const newUsers = await createManyInstitutionUsers(
      institutionId,
      parsedBody.map(({ email, name }) => ({
        email,
        name,
        role: "member",
      })),
    );

    const entries = Object.entries(body.fieldValues) as [
      keyof FieldIdToEmailsWithValueMapping,
      FieldIdToEmailsWithValueMapping[keyof FieldIdToEmailsWithValueMapping],
    ][];

    // fetch all users again coming from payload, so existing users can also be added to new groups, and data fields attached
    const validUsers = await prisma.user.findMany({
      where: {
        email: {
          in: body.users.map((i) => i.email),
        },
      },
      select: {
        id: true,
        email: true,
      },
    });

    await setInstitutionUserDataFieldValues({
      institutionId,
      values: entries.flatMap(([fieldId, emailToValueMappedArray]) => {
        return emailToValueMappedArray
          .map((u) => {
            const email = Object.keys(u)[0];
            const user = validUsers.find((u) => u.email === email);
            const value = Object.values(u)[0]?.toString();

            if (user && value)
              return {
                value,
                fieldId,
                userId: user.id,
              } satisfies InstitutionUserDataFieldValue;
          })
          .filter(filterUndefined);
      }),
    });

    const groupEntries = Object.entries(body.groupValues) as [
      keyof GroupIdToEmailIdsMapping,
      GroupIdToEmailIdsMapping[keyof GroupIdToEmailIdsMapping],
    ][];

    // add the newUsers to group if the group column exists
    await Promise.allSettled(
      groupEntries.map(([groupId, userEmails]) => {
        const validUids = validUsers
          .filter(({ email }) => userEmails.includes(email))
          .map(({ id }) => id);

        return addUsersToInstitutionUserGroup(
          validUids,
          groupId,
          institutionId,
        );
      }),
    );

    res.json({ success: true, newUsers });
  } catch (e) {
    const err = e as HttpError;
    sentry.captureException(err);
    res.status(err.status ?? 500).json(err.message);
  }
}
