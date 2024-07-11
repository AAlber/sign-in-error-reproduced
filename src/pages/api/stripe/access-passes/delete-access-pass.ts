import type { NextApiRequest, NextApiResponse } from "next";
import { deleteAccessPass } from "@/src/server/functions/server-access-passes/db-requests";
import { stripeApiHandler } from "@/src/server/functions/server-stripe/api-handler";
import type { AccessPassIdData } from "@/src/utils/stripe-types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  return await stripeApiHandler<AccessPassIdData>({
    req,
    res,
    functionToRun: deleteAccessPass,
    requiresStripeAccount: false,
    requiredVars: [],
    addBackendVars: ["userId"],
    method: "POST",
    include: [],
    errorMessage: "Failed to delete Access Pass",
  });
}
