import type { NextApiRequest, NextApiResponse } from "next";
import { reactivateAddOn } from "@/src/server/functions/server-paid-add-ons";
import { stripeApiHandler } from "@/src/server/functions/server-stripe/api-handler";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  return await stripeApiHandler<{ priceId: string }>({
    req,
    res,
    functionToRun: reactivateAddOn,
    requiredVars: ["subscriptionId"],
    method: "POST",
    errorMessage: "Failed to cancel subscription",
  });
}
