import type { NextApiRequest, NextApiResponse } from "next";
import { createBillingPortalSession } from "@/src/server/functions/server-stripe";
import { stripeApiHandler } from "@/src/server/functions/server-stripe/api-handler";
import type { CreateBillingPortalSessionData } from "@/src/utils/stripe-types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  return await stripeApiHandler<CreateBillingPortalSessionData>({
    req,
    res,
    functionToRun: createBillingPortalSession,
    requiredVars: ["customerId"],
    requiresStripeAccount: true,
    addBackendVars: ["userId"],
    method: "POST",
    errorMessage: "Failed to create billing Portal.",
  });
}
