import type Stripe from "stripe";
import { canUpgradeInstantly } from "@/src/client-functions/client-stripe/data-extrapolation";
import { taxRate } from "@/src/client-functions/client-stripe/price-id-manager";
import { stripe } from "../../singletons/stripe";
import {
  convertToFuxamStripeSubscription,
  updateSubscription,
  validatePromoCode,
} from ".";
import { getScheduleIdAndCurrentPhase } from "./utils";

export const runCorrectUpdateProcedure = async ({
  subscription,
  newPrice,
  newQuantity,
  promotionCode,
}: {
  subscription: Stripe.Subscription;
  newPrice: string;
  newQuantity: number;
  promotionCode?: string;
}) => {
  const coupon = await validatePromoCode({ promoCode: promotionCode });
  if (
    canUpgradeInstantly({
      subscription: convertToFuxamStripeSubscription(subscription),
      newPrice,
      newQuantity,
    })
  ) {
    if (subscription.schedule) {
      await stripe.subscriptionSchedules.release(
        subscription.schedule as string,
      );
    }
    return await updateSubscription({
      subscription,
      newPrice,
      newQuantity,
      couponId: coupon?.id,
    });
  } else {
    return await updateSubscriptionScheduleNew({
      subscription,
      itemToAddToSuscriptionNextMonth: {
        price: newPrice,
        quantity: newQuantity,
      },
      couponId: coupon?.id,
    });
  }
};

export const getScheduleIdIfNotExists = async (
  subscription: Stripe.Subscription,
) => {
  if (!subscription.schedule) {
    const schedule = await createSchedule(subscription);
    return schedule.id;
  } else return subscription.schedule as string;
};

const createSchedule = async (subscription: Stripe.Subscription) => {
  return await stripe.subscriptionSchedules.create({
    from_subscription: subscription.id,
  });
};

export const getQuantityAndPriceIdOfNextMonth = async (
  subscription: Stripe.Subscription,
  subscriptionSchedule: Stripe.SubscriptionSchedule,
) => {
  const subscriptionPhases = subscriptionSchedule.phases;
  let nextMonthPriceId, nextMonthQuantity, couponId;
  if (subscriptionPhases[1]) {
    nextMonthQuantity =
      subscriptionPhases[subscriptionPhases.length - 1]?.items[0]?.quantity;
    nextMonthPriceId =
      subscriptionPhases[subscriptionPhases.length - 1]?.items[0]?.price;
    couponId = subscriptionPhases[subscriptionPhases.length - 1]?.coupon;
  } else {
    nextMonthQuantity = subscription.items.data[0]?.quantity;
    nextMonthPriceId = subscription.items.data[0]?.price.id;
    couponId = undefined;
  }
  return {
    quantity: nextMonthQuantity,
    priceId: nextMonthPriceId,
    couponId: couponId,
  };
};

type SubscriptionItemParams = {
  price?: string;
  quantity?: number;
};
export const updateSubscriptionScheduleNew = async ({
  subscription,
  itemToAddToSuscriptionNextMonth,
  couponId,
}: {
  subscription: Stripe.Subscription;
  itemToAddToSuscriptionNextMonth: SubscriptionItemParams;
  couponId?: string;
}) => {
  const { scheduleId, currentPhase } =
    await getScheduleIdAndCurrentPhase(subscription);

  const schedule = await stripe.subscriptionSchedules.update(scheduleId, {
    phases: [
      {
        start_date: currentPhase?.start_date,
        end_date: currentPhase?.end_date,
        default_tax_rates: [taxRate],
        items: [
          {
            price: subscription.items.data[0]?.price.id,
            quantity: subscription.items.data[0]?.quantity,
          },
        ],
      },
      {
        start_date: currentPhase?.end_date,
        default_tax_rates: [taxRate],
        metadata: {
          hasReceived5PercentNotification: "false",
          hasReceived10PercentNotification: "false",
          hasReceived20PercentNotification: "false",
          hasReceivedOverageNotification: "false",
          hasReceivedMaxUserNotification: "false",
          companyName: subscription.metadata.companyName!,
        },
        items: [itemToAddToSuscriptionNextMonth],
        ...(couponId ? { coupon: couponId } : {}),
      },
    ],
    end_behavior: "release",
  });
  return schedule;
};
