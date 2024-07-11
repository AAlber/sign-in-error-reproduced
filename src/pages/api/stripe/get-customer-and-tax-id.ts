import type { NextApiRequest, NextApiResponse } from "next";
import { getCustomerAndTaxId } from "@/src/server/functions/server-stripe";
import { stripeApiHandler } from "@/src/server/functions/server-stripe/api-handler";

export type GetDiscountArgs = {
  promoCode?: string;
  promoId?: string;
};
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  return await stripeApiHandler<{ couponId: string }>({
    req,
    res,
    functionToRun: getCustomerAndTaxId,
    requiredVars: ["customerId"],
    method: "GET",
    errorMessage: "Failed to retrieve your customer.",
  });
}
