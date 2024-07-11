import type { NextApiRequest, NextApiResponse } from "next";
import { getAccessPassStatusInfos } from "@/src/server/functions/server-access-passes";
import { stripeApiHandler } from "@/src/server/functions/server-stripe/api-handler";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  return await stripeApiHandler({
    req,
    res,
    functionToRun: getAccessPassStatusInfos,
    requiresStripeAccount: false,
    requiredVars: ["customerId"],
    method: "GET",
    addBackendVars: ["institutionId"],
    include: ["accessPasses"],
    errorMessage: "Failed to get all access passes.",
  });
}
