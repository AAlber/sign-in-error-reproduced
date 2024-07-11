import type { InstitutionStripeAccount, PaidAddOn } from "@prisma/client";
import { taxRate } from "@/src/client-functions/client-stripe/price-id-manager";
import type {
  CreateCheckoutSessionData,
  PaidAddOnStatusInfo,
} from "@/src/utils/stripe-types";
import { stripe } from "../../singletons/stripe";
import { getPaidAddOnsOfInstitution } from "./db-requests";
import { getCorrectAddOn } from "./utils";

export const createCheckoutSession = async (
  stripeAccount: InstitutionStripeAccount,
  data?: CreateCheckoutSessionData,
): Promise<{ sessionUrl: string | null }> => {
  const coupon = data?.accessPassCouponId
    ? await stripe.coupons.retrieve(data?.accessPassCouponId as string)
    : null;
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price: data?.priceId,
        quantity: data?.quantity,
      },
    ],
    ...(coupon
      ? {
          discounts: [
            {
              coupon: coupon.id,
            },
          ],
        }
      : {}),
    customer_update: {
      name: "auto",
      address: "auto",
    },
    subscription_data: {
      metadata: {
        ...data?.metadata,
        institutionId: data?.institutionId as string,
      },
      default_tax_rates: [taxRate],
    },
    billing_address_collection: "required",
    phone_number_collection: { enabled: true },
    tax_id_collection: { enabled: true },
    ...(!data?.accessPassCouponId ? { allow_promotion_codes: true } : {}),
    currency: "eur",
    consent_collection: {
      terms_of_service: "required",
    },
    saved_payment_method_options: {
      payment_method_save: "enabled",
      allow_redisplay_filters: ["always"],
    },
    customer: stripeAccount.customerId as string,
    mode: "subscription",
    success_url: data?.success_url as string,
    cancel_url: `${process.env.SERVER_URL}`,
  });
  return { sessionUrl: session.url };
};

export const getStatusOfPaidAddOns = async (data: {
  institutionId: string;
}): Promise<PaidAddOnStatusInfo[]> => {
  const paidAddOns = await getPaidAddOnsOfInstitution(data.institutionId);
  const result: PaidAddOnStatusInfo[] = [];
  if (!paidAddOns) return result;
  const promises: Promise<any>[] = [];
  for (const addOn of paidAddOns) {
    promises.push(getAddOnWithSubscription(addOn));
  }
  return await Promise.all(promises);
};

const getAddOnWithSubscription = async (addOn: PaidAddOn) => {
  if (addOn.addOnSubscriptionId) {
    const subscription = await stripe.subscriptions.retrieve(
      addOn.addOnSubscriptionId,
    );
    return {
      active: addOn.addOnSubscriptionStatus === "active",
      status: addOn.addOnSubscriptionStatus!,
      addOn: addOn,
      subscription: subscription,
    };
  }
};

export const cancelAddOn = async (
  stripeAccount: any,
  data?: { priceId: string },
) => {
  const addOn = getCorrectAddOn(
    stripeAccount.paidAddOns,
    data?.priceId as string,
  );
  return (
    addOn &&
    (await stripe.subscriptions.update(addOn?.addOnSubscriptionId, {
      cancel_at_period_end: true,
    }))
  );
};
export const reactivateAddOn = async (
  stripeAccount: any,
  data?: { priceId: string },
) => {
  const addOn = getCorrectAddOn(
    stripeAccount.paidAddOns as any,
    data?.priceId as string,
  );
  return (
    addOn &&
    (await stripe.subscriptions.update(addOn?.addOnSubscriptionId, {
      cancel_at_period_end: false,
    }))
  );
};
