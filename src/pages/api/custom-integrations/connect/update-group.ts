import * as Sentry from "@sentry/nextjs";
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/src/server/db/client";
import { supportedOrganizations } from "./supported-organisations";
import type { ConnectGroupUpdateOperation } from "./types";

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

  const data = req.body as ConnectGroupUpdateOperation;

  if (!data.id) {
    return res.status(400).send("id is required.");
  }

  if (!data.name) {
    return res.status(400).send("name is required.");
  }

  if (!data.institutionId) {
    return res.status(400).send("InstitutionId is required.");
  }

  Sentry.setContext("connect-update-group", data);

  Sentry.addBreadcrumb({ message: "Checking if organization is supported" });

  if (!supportedOrganizations.includes(data.institutionId)) {
    return res
      .status(400)
      .send("Organization does not have connect integration enabled.");
  }

  Sentry.addBreadcrumb({ message: "Updating group" });

  const groupOrganiser = data.groupOrganiser || "";

  const group = await prisma.institutionUserGroup.upsert({
    where: {
      id: data.id,
    },
    update: {
      name: data.name,
      additionalInformation: groupOrganiser,
    },
    create: {
      id: data.id,
      name: data.name,
      additionalInformation: groupOrganiser,
      institutionId: data.institutionId,
    },
  });

  return res.json({ status: "success", group });
}
