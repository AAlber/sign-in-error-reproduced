import type { NextApiRequest, NextApiResponse } from "next";
import { updateCustomerCompanyName } from "@/src/server/functions/server-stripe";
import { stripeApiHandler } from "@/src/server/functions/server-stripe/api-handler";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  return await stripeApiHandler<{ companyName: string }>({
    req,
    res,
    functionToRun: updateCustomerCompanyName,
    requiredVars: ["customerId"],
    method: "POST",
  });
}
