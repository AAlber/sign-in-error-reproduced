import type { NextApiRequest, NextApiResponse } from "next";
import { createAccessPassSubscription } from "@/src/server/functions/server-access-passes";
import { stripeApiHandler } from "@/src/server/functions/server-stripe/api-handler";
import type { CreateAccessPassSubscriptionData } from "@/src/utils/stripe-types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  return await stripeApiHandler<CreateAccessPassSubscriptionData>({
    req,
    res,
    functionToRun: createAccessPassSubscription,
    canCreateNewStripeAccount: true,
    requiredVars: [],
    addBackendVars: ["institutionId", "userId"],
    method: "POST",
    include: ["accessPasses"],
    errorMessage: "Failed to cancel subscription",
  });
}
