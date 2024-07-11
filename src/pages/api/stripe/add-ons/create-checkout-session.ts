import type { NextApiRequest, NextApiResponse } from "next";
import { createCheckoutSession } from "@/src/server/functions/server-paid-add-ons";
import { stripeApiHandler } from "@/src/server/functions/server-stripe/api-handler";
import type { CreateCheckoutSessionData } from "@/src/utils/stripe-types";

export type UpdateSubscriptionPaymentMethod = {
  customerId;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  return await stripeApiHandler<CreateCheckoutSessionData>({
    req,
    res,
    functionToRun: createCheckoutSession,
    requiredVars: [],
    addBackendVars: ["institutionId"],
    canCreateNewStripeAccount: true,
    method: "POST",
    errorMessage: "Failed to create a checkout session.",
  });
}
