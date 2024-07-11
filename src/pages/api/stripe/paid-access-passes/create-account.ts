import type { NextApiRequest, NextApiResponse } from "next";
import { createStripeConnectAccount } from "@/src/server/functions/server-paid-access-passes";
import { stripeApiHandler } from "@/src/server/functions/server-stripe/api-handler";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  return await stripeApiHandler({
    req,
    res,
    functionToRun: createStripeConnectAccount,
    requiresStripeAccount: true,
    requiredVars: [],
    addBackendVars: ["userId"],
    method: "POST",
    include: [],
    errorMessage: "Failed to create stripe connect account.",
  });
}
