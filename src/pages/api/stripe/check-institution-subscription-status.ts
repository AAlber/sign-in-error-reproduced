import type { NextApiRequest, NextApiResponse } from "next";
import { checkInstitutionSubscriptionStatus } from "@/src/server/functions/server-stripe";
import { stripeApiHandler } from "@/src/server/functions/server-stripe/api-handler";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  return await stripeApiHandler({
    req,
    res,
    functionToRun: checkInstitutionSubscriptionStatus,
    requiredVars: [],
    method: "GET",
    errorMessage: "Failed to check subscription status",
  });
}
