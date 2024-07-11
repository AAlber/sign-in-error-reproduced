import type { PrismaPromise } from "@prisma/client";
import { prisma } from "@/src/server/db/client";

/**
 * WARNING!!!
 *
 * This function truncates all tables from the database. Used to clear database after test!
 * Make sure you are in TEST environment before running this function!
 * Make sure you you are running script using `doppler run -c github --` to ensure
 * you are inside TEST environment
 *
 * https://www.prisma.io/docs/orm/prisma-client/queries/crud#deleting-all-data-with-raw-sql--truncate
 */

export async function nukeTESTdb() {
  if (process.env.NODE_ENV !== "test") {
    throw new Error("TRUNCATE DB PREVENTED! NOT IN TEST ENVIRONMENT!");
  }

  const transactions: PrismaPromise<any>[] = [];
  transactions.push(prisma.$executeRaw`SET FOREIGN_KEY_CHECKS = 0;`);

  const tablenames = await prisma.$queryRaw<
    Array<{ TABLE_NAME: string }>
  >`SELECT TABLE_NAME 
  FROM INFORMATION_SCHEMA.TABLES
  WHERE TABLE_TYPE = 'BASE TABLE' AND TABLE_SCHEMA = 'fuxam-web-app';`;

  for (const { TABLE_NAME } of tablenames) {
    if (TABLE_NAME !== "_prisma_migrations") {
      try {
        transactions.push(prisma.$executeRawUnsafe(`TRUNCATE ${TABLE_NAME};`));
      } catch (error) {
        console.log({ error });
      }
    }
  }

  transactions.push(prisma.$executeRaw`SET FOREIGN_KEY_CHECKS = 1;`);

  try {
    await prisma.$transaction(transactions);
  } catch (error) {
    console.log({ error });
  }
}
