// import { filterUndefined } from "../src/client-functions/client-utils";
import { prisma } from "../src/server/db/client";
// import { updatePartialInstitutionSettings } from "../src/server/functions/server-institution-settings";

export function filterUndefined<T>(value: T | undefined): value is T {
  return !!value;
}

export default async function randomSeedOperation() {
  try {
    const institutions = await prisma.institution.findMany();
    institutions.forEach(async (obj) => {
      // await updatePartialInstitutionSettings(obj.id, {
      //   storage_gb_per_user: 3,
      // })
    });
  } catch (e) {
    console.error((e as Error).message);
    process.exit(1);
  }
}
