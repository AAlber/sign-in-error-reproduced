import type { NextApiRequest, NextApiResponse } from "next";
import { getAllTaxRates } from "@/src/server/functions/server-paid-access-passes/tax-rates";
import { stripeApiHandler } from "@/src/server/functions/server-stripe/api-handler";
import type { CreateCheckoutSessionData } from "@/src/utils/stripe-types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  return await stripeApiHandler<CreateCheckoutSessionData>({
    req,
    res,
    functionToRun: getAllTaxRates,
    requiredVars: ["customerId", "institutionId"],
    method: "GET",
    errorMessage: "Failed to list tax rates.",
  });
}
