import fs from "fs";
import Papa from "papaparse";
import path from "path";
import { prisma } from "../src/server/db/client";

export default async function getUsersOfInstitution({
  institutionId,
  saveCsv,
}: {
  institutionId: string;
  saveCsv: boolean;
}) {
  try {
    const roles = await prisma.role.findMany({
      where: {
        institutionId: institutionId,
        layerId: institutionId,
        role: {
          in: ["member"],
        },
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    const users = roles.map((role) => role.user);
    users.sort((a, b) => a.name.localeCompare(b.name));
    if (!saveCsv) return;

    const csvUsers = Papa.unparse(users);
    fs.writeFileSync(path.resolve(__dirname, "./users.csv"), csvUsers);
    console.log("CSV file has been saved as 'users.csv'");
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}
