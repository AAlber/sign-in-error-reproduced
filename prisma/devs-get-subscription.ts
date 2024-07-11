import Stripe from "stripe";
import { prisma } from "../src/server/db/client";
import { updateOldSubscriptionToNoLongerUsed } from "./extend-subscription-of-institution";

export default async function devsGetSubscribtion({
  institutionName,
  environment,
  withTestClock,
}: {
  institutionName: string;
  environment: "prod" | "dev";
  withTestClock: boolean;
}) {
  try {
    const productionPriceId = "price_1NH6biEwHpTUe8W70yZWvsJ9";
    const devPriceId = "price_1NFxsPEwHpTUe8W7ZHz35bDZ";
    const selectedPriceID =
      environment === "prod" ? productionPriceId : devPriceId;
    const devCouponId = "u9lyD8PG";
    const productionCouponId = "2PIL5bmO";
    const selectedCouponId =
      environment === "prod" ? productionCouponId : devCouponId;
    const stripe = new Stripe(process.env.STRIPE_SK!, {
      apiVersion: "2024-04-10",
    });

    const testClock = await stripe.testHelpers.testClocks.create({
      frozen_time: Math.floor(new Date().getTime() / 1000),
      name: "Test Clock - " + new Date().getTime(),
    });

    const stripeCustomer = await stripe.customers.create({
      name: institutionName,
      ...(withTestClock ? { test_clock: testClock.id } : {}),
    });

    const institution = await prisma.institution.findFirst({
      where: {
        name: institutionName,
      },
      include: {
        stripeAccount: true,
      },
    });
    const stripeAcc = institution?.stripeAccount;
    if (
      institution &&
      stripeAcc &&
      stripeAcc.customerId &&
      stripeAcc.subscriptionId
    ) {
      await updateOldSubscriptionToNoLongerUsed(
        stripeAcc.subscriptionId,
        stripe,
      );
    }
    console.log(`Created Stripe Customer !`, stripeCustomer);

    const stripeSubscription = await stripe.subscriptions.create({
      customer: stripeCustomer.id,
      items: [
        {
          price: selectedPriceID,
          quantity: 10000,
        },
      ],
      cancel_at_period_end: true,
      // ...(withTestClock ? {test_clock: testClock.id}: {}),
      metadata: {
        institutionId: institution!.id,
        isTestInstitution: "true",
      },
      coupon: selectedCouponId,
    });

    console.log(`Created Subscription !`, stripeSubscription.id);

    const instiStripeAccount = await prisma.institutionStripeAccount.upsert({
      where: {
        institutionId: institution!.id,
      },
      update: {
        institutionId: institution!.id,
        customerId: stripeCustomer.id,
        subscriptionId: stripeSubscription.id,
        subscriptionStatus: "active",
      },
      create: {
        institutionId: institution!.id,
        customerId: stripeCustomer.id,
        subscriptionId: stripeSubscription.id,
        subscriptionStatus: "active",
      },
    });
    console.log("Created Institution Stripe Account !", instiStripeAccount);

    console.log(`Setup mock institution done!`);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}
