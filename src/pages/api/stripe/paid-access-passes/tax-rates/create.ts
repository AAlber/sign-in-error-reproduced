import type { NextApiRequest, NextApiResponse } from "next";
import { createTaxRate } from "@/src/server/functions/server-paid-access-passes/tax-rates";
import { stripeApiHandler } from "@/src/server/functions/server-stripe/api-handler";
import type { CreateTaxRateData } from "@/src/utils/stripe-types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  return await stripeApiHandler<CreateTaxRateData>({
    req,
    res,
    functionToRun: createTaxRate,
    requiredVars: ["customerId", "institutionId"],
    method: "POST",
    errorMessage: "Failed to create tax rate.",
  });
}
