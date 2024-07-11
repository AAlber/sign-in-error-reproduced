import Stripe from "stripe";
import { convertToFuxamAdminDashSubscription } from "@/src/server/functions/server-stripe";
import { prisma } from "../src/server/db/client";

export default async function extendSubscriptionOfInstitution({
  environment,
  institutionId,
  name,
  cancelDate,
}: {
  environment: "prod" | "dev";
  institutionId: string;
  name: string;
  cancelDate: number;
}) {
  const productionPriceId = "price_1NH6bUEwHpTUe8W7TvUQfDKg";
  const devPriceId = "price_1NFxumEwHpTUe8W7ylkfurKF";
  const selectedPriceID =
    environment === "prod" ? productionPriceId : devPriceId;
  const devCouponId = "u9lyD8PG";
  const productionCouponId = "2PIL5bmO";
  const selectedCouponId =
    environment === "prod" ? productionCouponId : devCouponId;

  try {
    const stripe = new Stripe(process.env.STRIPE_SK!, {
      apiVersion: "2024-04-10",
    });
    let stripeCustomerId;
    const stripeAcc = await prisma.institutionStripeAccount.findUnique({
      where: {
        institutionId: institutionId,
      },
    });
    console.log("old subscription id", stripeAcc?.subscriptionId);
    if (stripeAcc && stripeAcc.customerId) {
      stripeCustomerId = stripeAcc.customerId;
      if (stripeAcc.subscriptionId) {
        await updateOldSubscriptionToNoLongerUsed(
          stripeAcc.subscriptionId,
          stripe,
        );
      }
    } else {
      const stripeCustomer = await stripe.customers.create({
        name: name,
      });
      stripeCustomerId = stripeCustomer.id;
    }

    console.log(`Created Stripe Customer !`);

    const stripeSubscription = await stripe.subscriptions.create({
      customer: stripeCustomerId,
      items: [
        {
          price: selectedPriceID,
          quantity: 10,
        },
      ],
      cancel_at: cancelDate,
      metadata: {
        institutionId: institutionId,
        isTestInstitution: "true",
      },
      coupon: selectedCouponId,
      // cancel_at_period_end: true,
    });

    console.log(`Created Subscription !`);
    const newStripeAccount = await prisma.institutionStripeAccount.upsert({
      where: {
        institutionId: institutionId,
      },
      update: {
        institutionId: institutionId,
        customerId: stripeCustomerId,
        subscriptionId: stripeSubscription.id,
        subscriptionStatus: "active",
      },
      create: {
        institutionId: institutionId,
        customerId: stripeCustomerId,
        subscriptionId: stripeSubscription.id,
        subscriptionStatus: "active",
      },
    });
    console.log("Created Institution Stripe Account !", newStripeAccount);
    return convertToFuxamAdminDashSubscription(stripeSubscription);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}
export const updateOldSubscriptionToNoLongerUsed = async (
  subId: string,
  stripe: Stripe,
) => {
  try {
    const oldSubscription = await stripe.subscriptions.retrieve(subId);
    if (
      oldSubscription.metadata.isTestInstitution === "true" ||
      oldSubscription.status === "canceled"
    ) {
      await stripe.subscriptions.update(subId, {
        metadata: {
          ...oldSubscription.metadata,
          noLongerUsed: "true",
        },
      });
      console.log("oldSubscription was Updated");
    }
  } catch (e) {
    const error = e as Error;
    console.error(
      "Error updating old subscription to noLongerUsed",
      error.message,
    );
  }
};
