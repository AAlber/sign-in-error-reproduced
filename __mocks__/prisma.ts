import type { PrismaClient } from "@prisma/client";
import type { DeepMockProxy } from "jest-mock-extended";
import { mockDeep, mockReset } from "jest-mock-extended";
import * as p from "@/src/server/db/client";

jest.mock<typeof p>("../src/server/db/client", () => ({
  __esModule: true,
  boostedPrisma: mockDeep<typeof p.boostedPrisma>(),
  prisma: mockDeep<PrismaClient>(),
}));

beforeEach(() => {
  mockReset(prisma);
});

export const prisma = p.prisma as unknown as DeepMockProxy<PrismaClient>;
