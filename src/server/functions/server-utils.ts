import { getAuth } from "@clerk/nextjs/server";
import type { NextApiRequest, NextApiResponse } from "next";
import { log } from "@/src/utils/logger/logger";
import { getCurrentInstitutionId } from "./server-user";

export const getSettledPromises = async <T>(
  promises: Promise<any>[],
): Promise<T[]> => {
  const settledPromises = await Promise.allSettled(promises);
  const resultArray: T[] = [];
  for (const result of settledPromises) {
    if (result.status === "fulfilled" && result.value) {
      resultArray.push(result.value);
    }
  }
  return resultArray;
};

export function filterUniqueBy<T>(arr: T[], by: keyof T) {
  return arr.filter(
    (el, index, self) => index === self.findIndex((t) => t[by] === el[by]),
  );
}

type ApiFunction = (
  req: NextApiRequest,
  res: NextApiResponse,
) => Promise<void | NextApiResponse>;

export function withTryCatch(apiFunc: ApiFunction, undoFunc?: ApiFunction) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    log.context("Cloudflare Request Context - " + req.url, req);
    try {
      await log.timespan("Cloudflare Api Route -" + req.url, async () => {
        return await apiFunc(req, res);
      });
    } catch (e) {
      const error = e as Error;
      // console.error(e)
      log
        .error(
          "Cloudflare api route error - " +
            req.url +
            ", message:" +
            error.message,
        )
        .cli();
      undoFunc && (await undoFunc(req, res));
      return res.status(400).json({ message: error.message });
    }
  };
}

export async function runPreRequestChecks(
  req: NextApiRequest,
  res: NextApiResponse,
  expectedMethod?: "GET" | "POST" | "DELETE",
) {
  if (req.method !== expectedMethod)
    return { message: "Invalid request", status: 400 };
  const { userId } = getAuth(req);
  log.context("pre-request-checks-userId", {
    userId,
  });
  if (!userId) return { message: "Unauthorized", status: 401 };
  const institutionId = await getCurrentInstitutionId(userId);
  log.context("pre-request-checks-institutionId", {
    institutionId,
  });
  if (!institutionId) return { message: "Unauthorized", status: 401 };
  return { userId, institutionId };
}

/**
 * Utility function that strips out null and undefined values from an object
 * and returns the final query object without null and undefined values.
 */
export function buildQuery<T extends object | undefined>(conditions: T) {
  const query = {};
  const validConditions = conditions || {};
  for (const [key, value] of Object.entries(validConditions)) {
    if (value !== null && value !== undefined) {
      query[key] = value;
    }
  }
  return query as Required<T>;
}
