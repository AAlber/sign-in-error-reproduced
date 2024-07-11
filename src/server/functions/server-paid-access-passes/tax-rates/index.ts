import type { InstitutionStripeAccount } from "@prisma/client";
import { stripe } from "@/src/server/singletons/stripe";
import type {
  CreateTaxRateData,
  UpdateTaxRateData,
} from "@/src/utils/stripe-types";

export const createTaxRate = async (
  institutionStripeAccount: InstitutionStripeAccount,
  data?: CreateTaxRateData,
) => {
  if (!institutionStripeAccount.connectAccountId)
    throw new Error("No connected account found");
  if (!data) throw new Error("No data for tax rate found");

  const { country, displayName, inclusive, percentage } = data;
  return await stripe.taxRates.create(
    {
      country,
      display_name: displayName,
      tax_type: data.type,
      inclusive,
      percentage,
    },
    {
      stripeAccount: institutionStripeAccount.connectAccountId,
    },
  );
};

export const getAllTaxRates = async (
  institutionStripeAccount: InstitutionStripeAccount,
) => {
  if (!institutionStripeAccount.connectAccountId)
    throw new Error("No connected account found");
  return await stripe.taxRates.list({
    stripeAccount: institutionStripeAccount.connectAccountId,
  });
};

export const updateTaxRate = async (
  institutionStripeAccount: InstitutionStripeAccount,
  data?: UpdateTaxRateData,
) => {
  if (!institutionStripeAccount.connectAccountId)
    throw new Error("No connected account found");
  if (!data) throw new Error("No data to update tax rate found");

  return await stripe.taxRates.update(
    data?.taxRateId,
    {
      active: data.active,
    },
    {
      stripeAccount: institutionStripeAccount.connectAccountId,
    },
  );
};
