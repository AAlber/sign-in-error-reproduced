import type { NextApiRequest, NextApiResponse } from "next";
import { updateCustomerTaxId } from "@/src/server/functions/server-stripe";
import { stripeApiHandler } from "@/src/server/functions/server-stripe/api-handler";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  return await stripeApiHandler<{ taxId?: string }>({
    req,
    res,
    functionToRun: updateCustomerTaxId,
    requiredVars: ["customerId"],
    method: "POST",
  });
}
