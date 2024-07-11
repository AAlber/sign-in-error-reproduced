import type { NextApiRequest, NextApiResponse } from "next";
import { getInvoices } from "@/src/server/functions/server-stripe";
import { stripeApiHandler } from "@/src/server/functions/server-stripe/api-handler";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  return await stripeApiHandler<{ couponId: string }>({
    req,
    res,
    functionToRun: getInvoices,
    requiredVars: ["customerId"],
    include: ["accessPasses"],
    method: "GET",
    errorMessage: "Failed to retrieve invoices.",
  });
}
