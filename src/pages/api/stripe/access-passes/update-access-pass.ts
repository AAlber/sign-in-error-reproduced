import type { NextApiRequest, NextApiResponse } from "next";
import { updateAccessPass } from "@/src/server/functions/server-access-passes/db-requests";
import { stripeApiHandler } from "@/src/server/functions/server-stripe/api-handler";
import type { UpdateAccessPassData } from "@/src/utils/stripe-types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  return await stripeApiHandler<UpdateAccessPassData>({
    req,
    res,
    functionToRun: updateAccessPass,
    requiresStripeAccount: true,
    requiredVars: [],
    addBackendVars: ["userId"],
    method: "POST",
    include: [],
    errorMessage: "Failed to update AccessPass",
  });
}
