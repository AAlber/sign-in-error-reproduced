import type { NextApiRequest, NextApiResponse } from "next";
import { getCoupon } from "@/src/server/functions/server-stripe";
import { stripeApiHandler } from "@/src/server/functions/server-stripe/api-handler";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  return await stripeApiHandler<{ couponId: string }>({
    req,
    res,
    functionToRun: getCoupon,
    requiredVars: ["subscriptionId"],
    method: "GET",
    errorMessage: "Failed to retrieve the coupon.",
  });
}
