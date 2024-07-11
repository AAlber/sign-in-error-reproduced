import type { NextApiRequest, NextApiResponse } from "next";
import { getPaymentMethods } from "@/src/server/functions/server-stripe";
import { stripeApiHandler } from "@/src/server/functions/server-stripe/api-handler";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  return await stripeApiHandler<{ couponId: string }>({
    req,
    res,
    functionToRun: getPaymentMethods,
    requiredVars: ["customerId"],
    method: "GET",
  });
}
