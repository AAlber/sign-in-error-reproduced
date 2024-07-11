import type { Theme } from "@/src/client-functions/client-institution-theme";
import { prisma } from "../db/client";

export const updateIntitutionTheme = async (
  paletteName: Theme["name"],
  institutionId: string,
  customTheme: string,
) => {
  const institution = await prisma.institution.update({
    where: {
      id: institutionId,
    },
    data: {
      theme: paletteName,
      customThemeHEX: customTheme,
    },
  });

  return institution;
};

export const getInstitutionTheme = async (institutionId: string) => {
  const institution = await prisma.institution.findUnique({
    where: {
      id: institutionId,
    },
  });

  return institution?.theme;
};
