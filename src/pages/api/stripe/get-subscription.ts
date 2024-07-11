import type { NextApiRequest, NextApiResponse } from "next";
import { getSubscription } from "@/src/server/functions/server-stripe";
import { stripeApiHandler } from "@/src/server/functions/server-stripe/api-handler";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  return await stripeApiHandler({
    req,
    res,
    functionToRun: getSubscription,
    requiredVars: ["customerId", "subscriptionId"],
    method: "GET",
  });
}
