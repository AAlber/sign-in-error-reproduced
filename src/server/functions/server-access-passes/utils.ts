import type { AccessPass, AccessPassUsageLog } from "@prisma/client";

export const getSecondsInInterval = (interval, intervalCount) => {
  switch (interval) {
    case "day":
      return intervalCount * 24 * 60 * 60;
    case "week":
      return intervalCount * 7 * 24 * 60 * 60;
    case "month":
      return intervalCount * 30 * 24 * 60 * 60; // Approximation
    case "year":
      return intervalCount * 365 * 24 * 60 * 60; // Approximation
    default:
      throw new Error("Unknown interval: " + interval);
  }
};

export function findDuplicates(arr) {
  return [...new Set(arr.filter((item, index) => arr.indexOf(item) !== index))];
}

type AccessPassWithUsageLogs = AccessPass & { usageLogs: AccessPassUsageLog[] };

export function getUniqueUserIdsWithAccessPasses(
  accessPasses: AccessPassWithUsageLogs[],
) {
  const uniqueUserIds = new Set<string>();
  for (const pass of accessPasses) {
    for (const log of pass.usageLogs) {
      uniqueUserIds.add(log.userId);
    }
  }
  return uniqueUserIds;
}

export function getAmountOfUniqueUserIds(
  accessPasses: AccessPassWithUsageLogs[],
) {
  return getUniqueUserIdsWithAccessPasses(accessPasses).size;
}
