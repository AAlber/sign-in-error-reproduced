import type { Prisma } from "@prisma/client";

export type UserWithInstitutionData = Prisma.UserGetPayload<{
  include: {
    institution: true;
  };
}>;
