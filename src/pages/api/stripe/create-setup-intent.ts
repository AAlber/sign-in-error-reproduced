import type { NextApiRequest, NextApiResponse } from "next";
import { createSetupIntent } from "@/src/server/functions/server-stripe";
import { stripeApiHandler } from "@/src/server/functions/server-stripe/api-handler";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  return await stripeApiHandler<{ userId: string }>({
    req,
    res,
    functionToRun: createSetupIntent,
    requiredVars: ["customerId"],
    canCreateNewStripeAccount: true,
    addBackendVars: ["userId"],
    method: "GET",
    errorMessage: "Failed to create a setup intent.",
  });
}
