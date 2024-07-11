import type { NextApiRequest, NextApiResponse } from "next";
import { getStatusOfPaidAddOns } from "@/src/server/functions/server-paid-add-ons";
import { stripeApiHandler } from "@/src/server/functions/server-stripe/api-handler";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  return await stripeApiHandler<{ institutionId: string }>({
    req,
    res,
    functionToRun: getStatusOfPaidAddOns,
    requiredVars: ["subscriptionId"],
    method: "GET",
    errorMessage: "Failed to get status of paid add ons.",
  });
}
