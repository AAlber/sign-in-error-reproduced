import type Stripe from "stripe";
import type {
  AccessPassDetails,
  AccessPassStatusInfo,
} from "@/src/utils/stripe-types";
import {
  accessPassPriceArray,
  AccessPassPrices,
  AccessPassPricesProd,
  Five_Months,
  Four_Months,
  One_Day,
  One_Month,
  One_Week,
  Six_Months,
  Three_Days,
  Three_Months,
  Two_Months,
  Two_Weeks,
} from "../client-stripe/price-id-manager";
import { getKeyByValue } from "../client-utils";

export function formatEnumKey(enumKey: string): string {
  // Split the key by underscores
  const words = enumKey.split("_");

  // Capitalize each word and join them with a space
  const formattedKey = words
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");

  return formattedKey;
}
export function getNameOfPassFromInfo(info: AccessPassStatusInfo): string {
  return getNameOfPass(info.accessPass.stripePriceId);
}
export function getNameOfPass(priceId: string): string {
  const key = getKeyByValue(AccessPassPricesProd, AccessPassPrices, priceId);
  if (!key) throw new Error("No key found for price id");
  return formatEnumKey(key);
}
export const isAccessPassSubscription = (subscription: Stripe.Subscription) => {
  for (const priceId of accessPassPriceArray) {
    if (priceId === subscription.items.data[0]?.price.id) {
      return true;
    }
  }
  return false;
};

export const getAccessPassDetails = (priceId) => {
  return accessPassDetailsArray.find((details) => details.priceId === priceId);
};

export const accessPassDetailsArray: AccessPassDetails[] = [
  {
    name: getNameOfPass(One_Day),
    priceId: One_Day,
    price: "3.00",
    billingPeriodFormatted: "day",
  },
  {
    name: getNameOfPass(Three_Days),
    priceId: Three_Days,
    price: "4.00",
    billingPeriodFormatted: "3 days",
  },
  {
    name: getNameOfPass(One_Week),
    priceId: One_Week,
    price: "5.00",
    billingPeriodFormatted: "1 week",
  },
  {
    name: getNameOfPass(Two_Weeks),
    priceId: Two_Weeks,
    price: "6.00",
    billingPeriodFormatted: "2 weeks",
  },
  {
    name: getNameOfPass(One_Month),
    priceId: One_Month,
    price: "7.00",
    billingPeriodFormatted: "month",
  },
  {
    name: getNameOfPass(Two_Months),
    priceId: Two_Months,
    price: "14.00",
    billingPeriodFormatted: "2 months",
  },
  {
    name: getNameOfPass(Three_Months),
    priceId: Three_Months,
    price: "21.00",
    billingPeriodFormatted: "3 months",
  },
  {
    name: getNameOfPass(Four_Months),
    priceId: Four_Months,
    price: "28.00",
    billingPeriodFormatted: "4 months",
  },
  {
    name: getNameOfPass(Five_Months),
    priceId: Five_Months,
    price: "35.00",
    billingPeriodFormatted: "5 months",
  },
  {
    name: getNameOfPass(Six_Months),
    priceId: Six_Months,
    price: "42.00",
    billingPeriodFormatted: "6 months",
  },
];
