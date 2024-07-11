import type { InstitutionUserDataField, User } from "@prisma/client";
import * as Sentry from "@sentry/nextjs";
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/src/server/db/client";
import { supportedOrganizations } from "./supported-organisations";
import type { ConnectUserUpdateOperation } from "./types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    if (req.headers.authorization !== "Bearer " + process.env.FHS_SECRET) {
      return res.status(401).send("Unauthorized");
    }

    if (req.method !== "POST") {
      return res.status(405).send("Method not allowed");
    }

    const data = req.body as ConnectUserUpdateOperation;

    Sentry.setContext("connect-update-user", data);
    Sentry.addBreadcrumb({ message: "Checking if organization is supported" });

    if (!supportedOrganizations.includes(data.institutionId)) {
      return res
        .status(400)
        .send("Organization does not have connect integration enabled.");
    }

    Sentry.addBreadcrumb({ message: "Checking if SubjectGuid is present" });
    const subjectGuidField = data.user.customDataFields.find(
      (field) => field.fieldName === "SubjectGuid",
    );
    if (!subjectGuidField) {
      return res.status(400).send("SubjectGuid is required.");
    }

    Sentry.addBreadcrumb({ message: "Getting user by subjedctguid" });
    let user: User | null = null;
    let userExisted = true;
    let userHadAccess = true;

    const subjectGuid = subjectGuidField.value;
    try {
      user = await prisma.user.findFirst({
        where: {
          institutionUserData: {
            some: {
              institutionUserDataField: {
                name: "SubjectGuid",
              },
              institutionId: data.institutionId,
              value: subjectGuid,
            },
          },
        },
      });
    } catch (error) {
      Sentry.captureException(error);
      return res.status(500).send("Error while looking up user.");
    }

    Sentry.addBreadcrumb({ message: "Checking if user exists" });
    if (!user) {
      userExisted = false;
      Sentry.addBreadcrumb({ message: "Creating user..." });
      try {
        user = await prisma.user.create({
          data: {
            name: data.user.name,
            email: data.user.email,
          },
        });
      } catch (error) {
        Sentry.addBreadcrumb({
          message: "User creation failed, user might exist",
        });
        try {
          user = await prisma.user.findUniqueOrThrow({
            where: {
              email: data.user.email,
            },
          });
          const existingSubjectGuid =
            await prisma.institutionUserDataField.findFirst({
              where: {
                institutionId: data.institutionId,
                name: "SubjectGuid",
              },
            });
          if (!existingSubjectGuid) {
            Sentry.captureException(
              "No SubjectGuid field found in institution",
            );
            return res
              .status(500)
              .send(
                "No SubjectGuid field found in institution, cannot create user.",
              );
          }
          await prisma.user.update({
            where: {
              id: user.id,
            },
            data: {
              institutionUserData: {
                create: {
                  institutionId: data.institutionId,
                  value: subjectGuid,
                  institutionUserDataField: {
                    connect: {
                      id: existingSubjectGuid.id,
                    },
                  },
                },
              },
            },
          });
        } catch (error) {
          Sentry.captureException(error);
          return res.status(500).json({
            error: error,
            message:
              "Could not find user by subjectGuid, but also could not create user by email. This is likely due to a conflict with another user in the database.",
          });
        }
      }
    }

    const needsNameUpdate = user.name !== data.user.name;
    const needsEmailUpdate = user.email !== data.user.email;

    if (needsNameUpdate) {
      try {
        Sentry.addBreadcrumb({ message: "Updating user name information..." });
        await prisma.user.update({
          where: {
            id: user.id,
          },
          data: {
            name: data.user.name,
          },
        });
      } catch (error) {
        Sentry.captureMessage("FHS update user name failed", {
          level: "info",
          extra: {
            userId: user?.id,
            data: data,
            error: error,
          },
        });
        return res
          .status(500)
          .json({ error: error, message: "User update failed" });
      }
    }

    if (needsEmailUpdate) {
      try {
        Sentry.addBreadcrumb({ message: "Updating user email information..." });
        await prisma.user.update({
          where: {
            id: user.id,
          },
          data: {
            email: data.user.email,
          },
        });
      } catch (error) {
        Sentry.captureMessage("FHS update user email failed", {
          level: "log",
          extra: {
            userId: user?.id,
            data: data,
            error: error,
          },
        });
        return res.status(500).json({
          error: error,
          message:
            "User email update failed, this is likely due to a confict with another email in the database.",
        });
      }
    }

    Sentry.addBreadcrumb({ message: "Checking if user has access" });
    const roleCount = await prisma.role.count({
      where: {
        layerId: data.institutionId,
        institutionId: data.institutionId,
        userId: user.id,
      },
    });
    const hasAccess = roleCount > 0;

    // 4. If user does not have access, create access (inactive)
    if (!hasAccess) {
      userHadAccess = false;
      Sentry.addBreadcrumb({
        message: "Creating access for user (inactive)...",
      });
      await prisma.role.create({
        data: {
          layerId: data.institutionId,
          institutionId: data.institutionId,
          userId: user.id,
          role: "member",
          active: false,
        },
      });
    }

    Sentry.addBreadcrumb({ message: "Checking if all data fields exist..." });
    const dataFields: InstitutionUserDataField[] = await Promise.all(
      data.user.customDataFields.map(async (field) => {
        const dataField = await prisma.institutionUserDataField.findFirst({
          where: { institutionId: data.institutionId, name: field.fieldName },
        });
        if (!dataField) {
          Sentry.addBreadcrumb({
            message: `Data field ${field.fieldName} does not exist. Creating...`,
          });
          const createdField = await prisma.institutionUserDataField.create({
            data: { institutionId: data.institutionId, name: field.fieldName },
          });
          return createdField;
        } else {
          return dataField;
        }
      }),
    );

    Sentry.addBreadcrumb({ message: "Updating data fields..." });
    const dataFieldValues = await Promise.all(
      dataFields.map(async (dataField) => {
        const value = data.user.customDataFields.find((field) => {
          return field.fieldName === dataField.name;
        })!.value;
        const dataFieldValue =
          await prisma.institutionUserDataFieldValue.findFirst({
            where: {
              institutionId: data.institutionId,
              userId: user!.id,
              fieldId: dataField.id,
            },
          });

        if (!dataFieldValue) {
          Sentry.addBreadcrumb({
            message: `Value for data field ${dataField.name} does not exist. Creating...`,
          });
          const createdValue =
            await prisma.institutionUserDataFieldValue.create({
              data: {
                institutionId: data.institutionId,
                userId: user!.id,
                fieldId: dataField.id,
                value: value,
              },
            });
          return createdValue;
        } else {
          Sentry.addBreadcrumb({
            message: `Updating value for data field ${dataField.name}...`,
          });
          const updatedValue =
            await prisma.institutionUserDataFieldValue.update({
              where: { id: dataFieldValue.id },
              data: { value: value },
            });
          return updatedValue;
        }
      }),
    );

    Sentry.addBreadcrumb({ message: "Checking if groups exist..." });
    const groups = await Promise.all(
      data.groups.map(async (group) => {
        const groupExists = await prisma.institutionUserGroup.findFirst({
          where: {
            institutionId: data.institutionId,
            name: group.name,
            id: group.id,
          },
        });
        if (!groupExists) {
          Sentry.addBreadcrumb({
            message: `Group ${group.name} does not exist. Creating...`,
          });
          const createdGroup = await prisma.institutionUserGroup.create({
            data: {
              id: group.id,
              institutionId: data.institutionId,
              name: group.name,
              additionalInformation: group.responsible,
            },
          });
          return createdGroup;
        } else {
          return groupExists;
        }
      }),
    );

    Sentry.addBreadcrumb({ message: "Deleting group memberships..." });
    await prisma.institutionUserGroupMembership.deleteMany({
      where: {
        institutionId: data.institutionId,
        userId: user.id,
      },
    });
    Sentry.addBreadcrumb({ message: "Updating group memberships..." });
    const groupMemberships = await Promise.all(
      groups.map(async (group) => {
        await prisma.institutionUserGroupMembership.create({
          data: {
            institutionId: data.institutionId,
            userId: user!.id,
            groupId: group.id,
          },
        });
      }),
    );

    return res.json({
      status: "success",
      message: {
        userExisted: userExisted,
        userAlreadyHadAccess: userHadAccess,
      },
      updated: {
        user: user,
        dataFields: dataFieldValues,
        groups: groupMemberships,
      },
    });
  } catch (error) {
    Sentry.captureException(error);
    return res.status(500).send("Unexpected internal server error");
  }
}
