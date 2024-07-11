import type { NextApiRequest, NextApiResponse } from "next";
import { createAccessPass } from "@/src/server/functions/server-access-passes/db-requests";
import { stripeApiHandler } from "@/src/server/functions/server-stripe/api-handler";
import type { CreateAccessPassData } from "@/src/utils/stripe-types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  return await stripeApiHandler<CreateAccessPassData>({
    req,
    res,
    functionToRun: createAccessPass,
    requiresStripeAccount: false,
    requiredVars: [],
    addBackendVars: ["userId"],
    method: "POST",
    include: [],
    errorMessage: "Failed to createAccessPass",
  });
}
