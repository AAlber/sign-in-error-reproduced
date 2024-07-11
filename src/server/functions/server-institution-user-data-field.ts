import type { Prisma } from "@prisma/client";
import type {
  InstitutionUserDataFieldWithValueData,
  ServerCreateInstitutionUserDataField,
  ServerGetInstitutionUserDataFieldValuesOfInstitution,
  ServerSetInstitutionUserDataFieldValue,
  UpdateInstitutionUserDataField,
} from "@/src/types/institution-user-data-field.types";
import { filterUndefined } from "@/src/utils/utils";
import { prisma } from "../db/client";
import { sentry } from "../singletons/sentry";
import { translateTextToUserPreferredLanguage } from "./server-user";
import { buildQuery } from "./server-utils";

export const createInstitutionUserDataField = async (
  data: ServerCreateInstitutionUserDataField,
) => {
  return await prisma.institutionUserDataField.create({
    data,
  });
};

export const getInstitutionUserDataFields = async (
  institutionId: string,
  includeValues = true,
): Promise<InstitutionUserDataFieldWithValueData[]> => {
  const fields = await prisma.institutionUserDataField.findMany({
    where: {
      institutionId,
    },
    include: {
      values: includeValues,
    },
  });

  return fields.map((field) => ({
    ...field,
    valueCount: field.values?.length ?? 0,
  }));
};

export const getInstitutionUserDataFieldsById = async (fieldIds: string[]) => {
  return await prisma.institutionUserDataField.findMany({
    where: {
      id: {
        in: fieldIds,
      },
    },
  });
};

export const getInstitutionUserDataField = async (id: string) => {
  return await prisma.institutionUserDataField.findUnique({
    where: {
      id,
    },
  });
};

export const updateInstitutionUserDataField = async (
  data: UpdateInstitutionUserDataField,
) => {
  return await prisma.institutionUserDataField.update({
    where: {
      id: data.id,
    },
    data,
  });
};

export const deleteInstitutionUserDataField = async (id: string) => {
  return await prisma.institutionUserDataField.delete({
    where: {
      id: id,
    },
  });
};

export async function setInstitutionUserDataFieldValues(
  data: ServerSetInstitutionUserDataFieldValue,
) {
  sentry.addBreadcrumb({
    message: "Setting institution userDataField values",
    data,
  });
  await prisma.institutionUserDataFieldValue.deleteMany({
    where: {
      institutionId: data.institutionId,
      fieldId: {
        in: data.values.map((value) => value.fieldId),
      },
      userId: {
        in: data.values.map((value) => value.userId),
      },
    },
  });
  return await prisma.institutionUserDataFieldValue.createMany({
    data: data.values
      .map((value) => {
        const trimmedValue = value.value.trim();
        return trimmedValue
          ? {
              fieldId: value.fieldId,
              userId: value.userId,
              value: trimmedValue,
              institutionId: data.institutionId,
            }
          : undefined; // avoid storing empty fieldValues
      })
      .filter(filterUndefined),
  });
}

export async function getInstitutionUserDataFieldValuesOfInstitution({
  institutionId,
  userIds,
}: ServerGetInstitutionUserDataFieldValuesOfInstitution) {
  return await prisma.institutionUserDataFieldValue.findMany({
    where: {
      institutionId: institutionId,
      ...(userIds ? { userId: { in: userIds } } : {}),
    },
  });
}

export async function getInstitutionUserDataValuesOfFields(
  fieldIds: string[],
  userIds: string[],
  language?: string,
) {
  const fields = await getInstitutionUserDataFieldsById(fieldIds);
  if (!fields) throw new Error("User Data Field not found");

  const users = await prisma.role.findMany({
    where: buildQuery<Prisma.RoleWhereInput>({
      userId: {
        in: userIds,
      },
      institutionId: !!fields.length
        ? {
            in: fields.map((field) => field.institutionId),
          }
        : undefined,
    }),
    select: {
      user: {
        select: {
          name: true,
          email: fieldIds.includes("email"),
          institutionUserData: !!fields.length && {
            where: { fieldId: { in: fieldIds } },
          },
        },
      },
      active: fieldIds.includes("status"),
    },
    distinct: ["userId"],
  });

  return users.map(({ user, active }) =>
    buildQuery({
      name: user.name,
      email: user.email,
      status: fieldIds.includes("status")
        ? active
          ? translateTextToUserPreferredLanguage("active", undefined, language)
          : translateTextToUserPreferredLanguage(
              "inactive",
              undefined,
              language,
            )
        : undefined,
      ...fields.reduce((acc, field) => {
        const userData = user.institutionUserData.find(
          (data) => data.fieldId === field.id,
        );
        return {
          ...acc,
          [field.name]: userData?.value || "",
        };
      }, {}),
    }),
  );
}

export async function getUsersWithFieldValuesOfField(fieldId: string): Promise<
  {
    name: string;
    email: string;
    [key: string]: string;
  }[]
> {
  const field = await getInstitutionUserDataField(fieldId);
  if (!field) throw new Error("User Data Field not found");
  const users = await prisma.user.findMany({
    where: {
      roles: {
        some: {
          institutionId: field.institutionId,
        },
      },
    },
    select: {
      name: true,
      email: true,
      institutionUserData: {
        where: {
          fieldId: fieldId,
        },
      },
    },
  });

  return users.map((user) => ({
    name: user.name,
    email: user.email,
    [field.name]:
      user.institutionUserData.find((data) => data.fieldId === fieldId)
        ?.value || "",
  }));
}

export async function getUnfilledUserDataFieldsOfUser(
  userId: string,
  institutionId: string,
) {
  const fields = await prisma.institutionUserDataField.findMany({
    where: {
      institutionId,
      collectFromUser: true,
    },
    select: {
      id: true,
      name: true,
      values: {
        where: {
          userId,
        },
        select: {
          value: true,
        },
      },
    },
  });

  const fieldsWithEmptyValues = fields.filter(
    (field) =>
      field.values.length === 0 ||
      field.values.every((value) => value.value === ""),
  );

  return fieldsWithEmptyValues;
}

export async function getFieldsToShowInUserIdCard(institutionId: string) {
  return await prisma.institutionUserDataField.findMany({
    select: {
      id: true,
      name: true,
    },
    where: {
      institutionId,
      showOnStudentIDCard: true,
    },
  });
}
