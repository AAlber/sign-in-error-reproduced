import type { NextApiRequest, NextApiResponse } from "next";
import { updateSubscriptionOrSchedule } from "@/src/server/functions/server-stripe";
import { stripeApiHandler } from "@/src/server/functions/server-stripe/api-handler";
import type { UpdateSubscriptionData } from "@/src/utils/stripe-types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  return await stripeApiHandler<UpdateSubscriptionData>({
    req,
    res,
    functionToRun: updateSubscriptionOrSchedule,
    requiredVars: ["customerId", "subscriptionId"],
    method: "POST",
  });
}
