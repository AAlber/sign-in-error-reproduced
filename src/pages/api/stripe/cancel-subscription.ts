import type { NextApiRequest, NextApiResponse } from "next";
import { cancelSubscription } from "@/src/server/functions/server-stripe";
import { stripeApiHandler } from "@/src/server/functions/server-stripe/api-handler";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  return await stripeApiHandler<any>({
    req,
    res,
    functionToRun: cancelSubscription,
    requiredVars: ["subscriptionId"],
    method: "POST",
    errorMessage: "Failed to cancel subscription",
  });
}
