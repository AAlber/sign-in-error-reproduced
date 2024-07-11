import { type Institution } from "@prisma/client";
import { prisma } from "../../server/db/client";

export async function getUserInstitutions(userId: string) {
  const roles = await prisma.role.findMany({
    where: {
      userId: userId,
    },
    select: {
      layerId: true,
    },
  });
  const userInstitutions: Institution[] = [];
  const institutions = await prisma.institution.findMany();
  roles.forEach((role) => {
    institutions.forEach((institution) => {
      if (institution.id == role.layerId) {
        if (!userInstitutions.includes(institution)) {
          userInstitutions.push(institution);
        }
      }
    });
  });
  return userInstitutions;
}
