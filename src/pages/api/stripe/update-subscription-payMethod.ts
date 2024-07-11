import type { NextApiRequest, NextApiResponse } from "next";
import { updateSubscriptionPaymentMethod } from "@/src/server/functions/server-stripe";
import { stripeApiHandler } from "@/src/server/functions/server-stripe/api-handler";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  return await stripeApiHandler<{ payMethodId: string }>({
    req,
    res,
    functionToRun: updateSubscriptionPaymentMethod,
    requiredVars: ["customerId", "subscriptionId"],
    method: "POST",
  });
}
