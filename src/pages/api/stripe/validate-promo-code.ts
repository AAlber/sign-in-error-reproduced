import type { NextApiRequest, NextApiResponse } from "next";
import { validatePromoCode } from "@/src/server/functions/server-stripe";
import { stripeApiHandler } from "@/src/server/functions/server-stripe/api-handler";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  return await stripeApiHandler<{
    promoCode: string;
  }>({
    req,
    res,
    functionToRun: validatePromoCode,
    requiresStripeAccount: false,
    requiredVars: ["customerId"],
    method: "POST",
  });
}
