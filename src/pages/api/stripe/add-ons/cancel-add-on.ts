import type { NextApiRequest, NextApiResponse } from "next";
import { cancelAddOn } from "@/src/server/functions/server-paid-add-ons";
import { stripeApiHandler } from "@/src/server/functions/server-stripe/api-handler";
import type { CreateCheckoutSessionData } from "@/src/utils/stripe-types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  return await stripeApiHandler<CreateCheckoutSessionData>({
    req,
    res,
    functionToRun: cancelAddOn,
    requiredVars: ["customerId", "institutionId"],
    method: "POST",
    errorMessage: "Failed to cancel add on.",
  });
}
