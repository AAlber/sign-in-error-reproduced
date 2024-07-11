import type { AccessPass, InstitutionStripeAccount } from "@prisma/client";
import type Stripe from "stripe";
import type { UpdateAccessPassData } from "@/src/utils/stripe-types";

export const getCorrectAccessPass = (
  accessPasses: AccessPass[],
  accessPassId: string,
) => {
  const accessPass = accessPasses.find(
    (accessPass) => accessPass.id === accessPassId,
  );
  if (!accessPass) throw new Error("Access pass not found");
  return accessPass;
};
export const getMaxUsers = (subscription: Stripe.Subscription) => {
  const maxUsersNumber = Number(subscription.metadata.maxUsers);
  const maxUsers = isNaN(maxUsersNumber) ? maxUsersNumber : undefined;
  return maxUsers;
};
export const accessPassExistsAlready = (
  accessPasses: AccessPass[],
  subscription: Stripe.Subscription,
) => {
  const accessPass = accessPasses.find(
    (pass) => pass.id === subscription.metadata.accessPassId,
  );
  return accessPass ? true : false;
};

export const extractPaymentInfoUpdate = async (
  stripeAccount: InstitutionStripeAccount,
  data?: UpdateAccessPassData,
): Promise<{
  unitAmount: number;
  currency: string;
  description: string;
  taxRateId: string;
  name: string;
}> => {
  let unitAmount, currency, description, taxRateId, name;
  if (data?.productAndPriceInfo) {
    unitAmount = data?.productAndPriceInfo?.unitAmount;
    currency = data?.productAndPriceInfo?.currency;
    description = data?.productAndPriceInfo?.description;
    taxRateId = data?.productAndPriceInfo?.taxRateId;
    name = data?.productAndPriceInfo?.name;
  }
  const accessPassPaymentInfo = {
    unitAmount,
    currency,
    description,
    taxRateId,
    name,
  };
  return accessPassPaymentInfo;
};
