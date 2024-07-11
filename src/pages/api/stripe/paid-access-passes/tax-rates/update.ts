import type { NextApiRequest, NextApiResponse } from "next";
import { updateTaxRate } from "@/src/server/functions/server-paid-access-passes/tax-rates";
import { stripeApiHandler } from "@/src/server/functions/server-stripe/api-handler";
import type { UpdateTaxRateData } from "@/src/utils/stripe-types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  return await stripeApiHandler<UpdateTaxRateData>({
    req,
    res,
    functionToRun: updateTaxRate,
    requiredVars: ["customerId", "institutionId"],
    method: "POST",
    errorMessage: "Failed to update tax rate.",
  });
}
