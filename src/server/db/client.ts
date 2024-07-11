import { PrismaClient } from "@prisma/client";

const prisma = (global.prisma || new PrismaClient()) as PrismaClient;
const boostedPrisma = new PrismaClient();
boostedPrisma.$queryRaw`SET @@boost_cached_queries = true`;

if (process.env.NODE_ENV === "development") {
  global.prisma = prisma;
  global.boostedPrisma = boostedPrisma;
}

export { boostedPrisma, prisma };
