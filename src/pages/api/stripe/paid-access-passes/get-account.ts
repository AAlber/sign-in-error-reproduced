import type { NextApiRequest, NextApiResponse } from "next";
import { getStripeConnectAccount } from "@/src/server/functions/server-paid-access-passes/db-requests";
import { stripeApiHandler } from "@/src/server/functions/server-stripe/api-handler";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  return await stripeApiHandler({
    req,
    res,
    functionToRun: getStripeConnectAccount,
    requiredVars: [],
    requiresStripeAccount: true,
    addBackendVars: ["institutionId"],
    method: "GET",
    include: [],
    errorMessage: "Failed to get stripe connect account.",
  });
}
