import type { NextApiRequest, NextApiResponse } from "next";
import { getUpcomingInvoicePreview } from "@/src/server/functions/server-stripe";
import { stripeApiHandler } from "@/src/server/functions/server-stripe/api-handler";
import type { UpdateSubscriptionData } from "@/src/utils/stripe-types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  return await stripeApiHandler<UpdateSubscriptionData>({
    req,
    res,
    functionToRun: getUpcomingInvoicePreview,
    requiresStripeAccount: true,
    requiredVars: ["customerId"],
    include: [],
    method: "POST",
    errorMessage: "Failed to retrieve invoices.",
  });
}
