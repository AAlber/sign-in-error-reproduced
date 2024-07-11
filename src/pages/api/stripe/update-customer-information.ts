import type { NextApiRequest, NextApiResponse } from "next";
import { updateCustomerInformation } from "@/src/server/functions/server-stripe";
import { stripeApiHandler } from "@/src/server/functions/server-stripe/api-handler";
import type { UpdateCustomerInformationData } from "@/src/utils/stripe-types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  return await stripeApiHandler<UpdateCustomerInformationData>({
    req,
    res,
    functionToRun: updateCustomerInformation,
    requiredVars: ["customerId"],
    method: "POST",
  });
}
