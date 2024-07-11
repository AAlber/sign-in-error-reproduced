import * as Sentry from "@sentry/nextjs";
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/src/server/db/client";
import { supportedOrganizations } from "./supported-organisations";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.headers.authorization !== "Bearer " + process.env.FHS_SECRET) {
    return res.status(401).send("Unauthorized");
  }

  if (req.method !== "GET") {
    return res.status(405).send("Method not allowed");
  }

  const subjectGuid = req.query.subjectGuid as string;
  const institutionId = req.query.institutionId as string;

  if (!institutionId) {
    return res
      .status(400)
      .json({ message: "InstitutionId is required in query parameters" });
  }

  if (!subjectGuid) {
    return res
      .status(400)
      .json({ message: "SubjectGuid is required in query parameters" });
  }

  Sentry.setContext("connect-get-user", {
    subjectGuid: subjectGuid,
    institutionId: institutionId,
  });

  Sentry.addBreadcrumb({ message: "Checking if organization is supported" });

  if (!supportedOrganizations.includes(institutionId)) {
    return res
      .status(400)
      .send("Organization does not have connect integration enabled.");
  }

  Sentry.addBreadcrumb({ message: "Getting user" });

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
    select: {
      id: true,
      email: true,
      name: true,
      institutionUserData: {
        where: {
          institutionId: institutionId,
        },
        select: {
          value: true,
        },
      },
    },
  });

  if (!user) {
    Sentry.captureMessage("Connect Integration (Get-User): User not found", {
      level: "info",
      extra: {
        subjectGuid,
        institutionId,
      },
    });
    return res.status(404).json({ message: "User not found" });
  }

  return res.json(user);
}
