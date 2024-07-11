import * as Sentry from "@sentry/nextjs";
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/src/server/db/client";
import { supportedOrganizations } from "./supported-organisations";
import type { ConnectUserRemoveAccessOperation } from "./types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.headers.authorization !== "Bearer " + process.env.FHS_SECRET) {
    return res.status(401).send("Unauthorized");
  }

  if (req.method !== "POST") {
    return res.status(405).send("Method not allowed");
  }

  const { subjectGuid, institutionId } =
    req.body as ConnectUserRemoveAccessOperation;

  if (!institutionId) {
    return res.status(400).send("InstitutionId is required.");
  }

  if (!subjectGuid) {
    return res.status(400).send("SubjectGuid is required.");
  }

  Sentry.setContext("connect-delete-user", {
    subjectGuid: subjectGuid,
    institutionId: institutionId,
  });

  Sentry.addBreadcrumb({ message: "Checking if organization is supported" });

  if (!supportedOrganizations.includes(institutionId)) {
    return res
      .status(400)
      .send("Organization does not have connect integration enabled.");
  }

  Sentry.addBreadcrumb({ message: "Inactivating user" });

  const user = await prisma.user.findFirst({
    where: {
      institutionUserData: {
        some: {
          institutionUserDataField: {
            name: "SubjectGuid",
          },
          institutionId: institutionId,
          value: subjectGuid,
        },
      },
    },
  });

  if (!user) {
    Sentry.captureMessage("Connect Integration (Delete-User): User not found", {
      level: "info",
      extra: {
        subjectGuid,
        institutionId,
      },
    });
    return res.status(404).json({ message: "User not found" });
  }
  Sentry.addBreadcrumb({ message: "Inactivating user" });

  await prisma.role.updateMany({
    where: {
      layerId: institutionId,
      institutionId: institutionId,
      userId: user.id,
    },
    data: {
      active: false,
    },
  });

  return res.json({
    status: "success",
    message: "User inactivated successfully",
  });
}
