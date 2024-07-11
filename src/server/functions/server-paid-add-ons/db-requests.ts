import type { InstitutionStripeAccount } from "@prisma/client";
import type Stripe from "stripe";
import { prisma } from "../../db/client";

export const getPaidAddOnsOfInstitution = async (institutionId: string) => {
  const institutionStripeAccount =
    await prisma.institutionStripeAccount.findUnique({
      where: {
        institutionId: institutionId,
      },
      include: {
        paidAddOns: true,
      },
    });
  return institutionStripeAccount?.paidAddOns;
};

export const createNewAddOn = async (
  subscription: Stripe.Subscription,
  stripeAccount: InstitutionStripeAccount,
) => {
  if (!subscription.items.data[0]?.price) return;
  await prisma.institutionStripeAccount.update({
    where: {
      id: stripeAccount.id,
    },
    data: {
      paidAddOns: {
        create: {
          addOnSubscriptionId: subscription.id,
          addOnSubscriptionStatus: subscription.status,
          addOnPriceId: subscription.items.data[0]?.price.id,
        },
      },
    },
  });
};
export const updateAddOn = async (
  subscription: Stripe.Subscription,
  stripeAccount: InstitutionStripeAccount,
) => {
  if (!subscription.items.data[0]?.price.id) throw new Error("No price id");

  await prisma.paidAddOn.updateMany({
    where: {
      institutionStripeAccountId: stripeAccount.id,
      addOnPriceId: subscription.items.data[0]?.price.id,
    },
    data: {
      addOnSubscriptionId: subscription.id,
      addOnSubscriptionStatus: subscription.status,
    },
  });
};

export const createNewStripeAccountAndPaidAddOn = async (
  institutionId: string,
  subscription: Stripe.Subscription,
) => {
  if (!subscription.items.data[0]?.price.id) throw new Error("No price id");
  await prisma.institutionStripeAccount.create({
    data: {
      institutionId: institutionId,
      customerId: subscription.customer as string,
      paidAddOns: {
        create: {
          addOnPriceId: subscription.items.data[0]?.price.id,
          addOnSubscriptionId: subscription.id,
          addOnSubscriptionStatus:
            subscription.status as Stripe.Subscription.Status,
        },
      },
    },
  });
};
