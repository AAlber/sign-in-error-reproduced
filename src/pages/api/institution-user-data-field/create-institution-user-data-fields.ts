import { getAuth } from "@clerk/nextjs/server";
import type { NextApiRequest, NextApiResponse } from "next";
import { createInstitutionUserDataField } from "@/src/server/functions/server-institution-user-data-field";
import { hasRolesWithAccess } from "@/src/server/functions/server-role";
import { getCurrentInstitutionId } from "@/src/server/functions/server-user";
import type { CreateInstitutionUserDataField } from "@/src/types/institution-user-data-field.types";
import { HttpError } from "@/src/utils/exceptions/http-error";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    if (req.method !== "POST") throw new HttpError("Invalid", 405);
    const { userId } = getAuth(req);
    const institutionUserDataField: CreateInstitutionUserDataField[] = req.body;

    if (!userId) throw new HttpError("Forbidden", 403);
    if (!institutionUserDataField)
      throw new HttpError("Missing Data Fields", 400);
    if (institutionUserDataField.some((i) => !i.name))
      throw new HttpError("Invalid", 400);

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

    const promises = institutionUserDataField.map((field) =>
      createInstitutionUserDataField({ ...field, institutionId }),
    );

    const result = await Promise.all(promises);
    res.json(result);
  } catch (e) {
    const err = e as HttpError;
    res.status(err.status ?? 500).json({ error: err.message ?? err });
  }
}

export type CreateInstitutionUserDataFieldArgs =
  CreateInstitutionUserDataField[];
