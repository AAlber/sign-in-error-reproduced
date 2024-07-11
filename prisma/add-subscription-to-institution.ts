import Stripe from "stripe";
import { prisma } from "../src/server/db/client";

export default async function createInstitutionSubscription({
  environment,
  institutionId,
  name,
}: {
  environment: "prod" | "dev";
  institutionId: string;
  name: string;
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

    const stripeCustomer = await stripe.customers.create({
      name: name,
    });

    console.log(`Created Stripe Customer !`);

    const stripeSubscription = await stripe.subscriptions.create({
      customer: stripeCustomer.id,
      items: [
        {
          price: selectedPriceID,
          quantity: 10000,
        },
      ],
      metadata: {
        institutionId: institutionId,
        isTestInstitution: "true",
      },
      coupon: selectedCouponId,
      cancel_at_period_end: true,
    });

    console.log(`Created Subscription !`);
    await prisma.institutionStripeAccount.upsert({
      where: {
        institutionId: institutionId,
      },
      update: {
        institutionId: institutionId,
        customerId: stripeCustomer.id,
        subscriptionId: stripeSubscription.id,
        subscriptionStatus: "active",
      },
      create: {
        institutionId: institutionId,
        customerId: stripeCustomer.id,
        subscriptionId: stripeSubscription.id,
        subscriptionStatus: "active",
      },
    });

    console.log(`Setup mock institution done!`);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}
