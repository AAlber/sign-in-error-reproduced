import type { NextApiRequest, NextApiResponse } from "next";
import { updateCustomerLanguage } from "@/src/server/functions/server-stripe";
import { stripeApiHandler } from "@/src/server/functions/server-stripe/api-handler";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  return await stripeApiHandler<any>({
    req,
    res,
    functionToRun: updateCustomerLanguage,
    requiredVars: ["customerId"],
    method: "POST",
  });
}
