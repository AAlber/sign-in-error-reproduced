import type {
  StripeAddressElementOptions,
  StripePaymentElementOptions,
} from "@stripe/stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import dayjs from "dayjs";
import type Stripe from "stripe";
import { useCompanyInfoEditor } from "@/src/components/institution-settings/setting-containers/insti-settings-billing/billing-info-editors/zustand";
import { useBilling } from "@/src/components/institution-settings/setting-containers/insti-settings-billing/zustand-billing";
import { env } from "@/src/env/client.mjs";
import type { FuxamStripeSubscription } from "@/src/utils/stripe-types";
import { standardPlanPriceIds, supportPackageArray } from "./price-id-manager";

export const moneyFormatter = Intl.NumberFormat("en", {
  style: "decimal",
  minimumFractionDigits: 2,
});

export function getPlanInformations(memberAmount): PlanInfo {
  const paymentLevelRanges = [
    { max: 500, level: planInformations[0] },
    { max: 2000, level: planInformations[1] },
    { max: Infinity, level: planInformations[2] },
  ];
  for (const range of paymentLevelRanges) {
    if (memberAmount < range.max && range.level) {
      return range.level;
    }
  }
  return planInformations[2]!;
}

export function isStripeInvoice(object: any): object is Stripe.Invoice {
  return object && object.object === "invoice";
}

export type PlanInfo = {
  monthlyPerUser: number;
  yearlyPerUser: number;
  yearlyPriceReduction: string;
  yearlyPriceReductionColor: "blue" | "green";
  description: string;
};

export const addReductionIfDiscounted = (
  price?: number,
  percentOff?: number,
) => {
  let result;
  if (percentOff && price) {
    result = price * (1 - percentOff / 100);
  } else {
    result = price;
  }
  return moneyFormatter.format(result);
};

const planInformations: PlanInfo[] = [
  {
    monthlyPerUser: 7,
    yearlyPerUser: 78,
    yearlyPriceReduction: "7%",
    yearlyPriceReductionColor: "green",
    description: "Fuxam Plan S",
  },
  {
    monthlyPerUser: 6,
    yearlyPerUser: 66,
    yearlyPriceReduction: "8%",
    yearlyPriceReductionColor: "green",
    description: "Fuxam Plan M",
  },
  {
    monthlyPerUser: 5,
    yearlyPerUser: 54,
    yearlyPriceReduction: "10%",
    yearlyPriceReductionColor: "green",
    description: "Fuxam Plan L",
  },
];

export const addressElementOptions: StripeAddressElementOptions = {
  mode: "billing",
  blockPoBox: true,
  fields: {
    phone: "always",
  },

  validation: {
    phone: {
      required: "always",
    },
  },
};
export const paymentElementOptions: StripePaymentElementOptions = {
  layout: {
    type: "accordion",
    defaultCollapsed: true,
    radios: false,
    spacedAccordionItems: true,
  },
  business: {
    name: "Fuxam",
  },

  fields: {
    billingDetails: {
      address: "never",
      email: "never",
      name: "never",
      phone: "never",
    },
  },
};

export const subscriptionIsBeingCancelled = (
  subscription?: FuxamStripeSubscription | Stripe.Subscription,
) => {
  const sub = subscription ? subscription : useBilling.getState().subscription;
  if (!sub) return false;
  return sub.cancel_at_period_end;
};

export const throwNoTaxIdError = (taxIdResult: any) => {
  const { setTaxIdInvalid } = useCompanyInfoEditor.getState();
  if (!taxIdResult) {
    setTaxIdInvalid(true);
    return "invalid";
  }
  return "valid";
};

export const getAttributesForElements = (
  isDark: boolean,
  locale,
  stripeSecret?: string,
) => {
  const [primaryColor, secondaryColor, textColor, bg, border] = isDark
    ? ["#1E293B", "#727F96", "white", "#081020", "#1E293B"]
    : ["#727F96", "#333645", "black", "#FFFFFF", "#1E293B"];

  const appearance = paymentAppearance(primaryColor, textColor, bg, border);
  const options = {
    clientSecret: stripeSecret,
    appearance: appearance,
  };
  const stripe = loadStripe(env.NEXT_PUBLIC_STRIPE_PK, {
    locale: locale,
  });
  return { stripe, options };
};

export const isSupportPackage = (priceId: any) => {
  return supportPackageArray.includes(priceId);
};

export function findLastDraftInvoiceFromStandardPlan(
  invoices: (Stripe.Invoice | Stripe.UpcomingInvoice)[],
) {
  return findLastInvoiceFromStandardPlan(invoices, true);
}

function findLastInvoiceFromStandardPlan(
  invoices: (Stripe.Invoice | Stripe.UpcomingInvoice)[],
  draftInvoice = false,
) {
  for (let i = 0; i < invoices.length; i++) {
    if (!isStripeInvoice(invoices[i])) continue;
    const stripeInvoice = invoices[i] as
      | Stripe.Invoice
      | Stripe.UpcomingInvoice;
    const correctStatus = draftInvoice
      ? stripeInvoice.status === "draft"
      : stripeInvoice.status !== "draft";
    if (
      standardPlanPriceIds.includes(
        stripeInvoice?.lines?.data[0]?.price?.id as string,
      ) &&
      correctStatus
    ) {
      return invoices[i];
    }
  }
  return null;
}

export const getLastStandardPlanInvoice = (
  invs?: (Stripe.Invoice | Stripe.UpcomingInvoice)[],
) => {
  const { invoices: invoicesFromState } = useBilling.getState();
  const invoices = invs ? invs : invoicesFromState;
  return findLastInvoiceFromStandardPlan(invoices);
};

export const getLastStandardPlanDraftInvoice = (
  invs?: (Stripe.Invoice | Stripe.UpcomingInvoice)[],
) => {
  const { invoices: invoicesFromState } = useBilling.getState();
  const invoices = invs ? invs : invoicesFromState;
  return findLastDraftInvoiceFromStandardPlan(invoices);
};

export const formatStripeMoney = (money) => {
  return (
    (money < 0 ? "- €" : "€") + moneyFormatter.format(Math.abs(money) / 100)
  );
};

export const formatStripeDate = (date: number, short?: boolean) => {
  const newDate = new Date(date * 1000);
  if (!short) {
    return dayjs(newDate).format("DD MM YY");
  } else {
    return dayjs(newDate).format("DD.MM");
  }
};

export function addTimeToTimestamp(
  unixTimestamp: number,
  amountOfTime: "month" | "year",
): number {
  const date = new Date(unixTimestamp * 1000);
  if (amountOfTime === "month") {
    date.setUTCMonth(date.getUTCMonth() + 1);
  } else {
    date.setUTCFullYear(date.getUTCFullYear() + 1);
  }
  return Math.floor(date.getTime() / 1000);
}

export function isCloserThan10Percent(num1: number, num2: number): boolean {
  const threshold = num2 * 0.9;
  return num1 >= threshold && num1 < num2;
}
export const paymentAppearance = (primaryColor, textColor, bg, border) => {
  return {
    variables: {
      fontFamily: "Sohne, system-ui, sans-serif",
      fontWeightNormal: "500",
      borderRadius: "6px",
      colorBackground: bg,
      colorPrimary: primaryColor,
      colorPrimaryText: textColor,
      colorText: textColor,
      colorTextSecondary: textColor,
      colorTextPlaceholder: "#727F96",
      colorIconTab: textColor,
      colorLogo: "dark",
    },

    rules: {
      ".Block, .Tab": {
        backgroundColor: bg,
        border: "1px solid " + border,
        boxShadow: "none",
        borderRadius: "6px",
        color: "var(--colorText)",
      },
      ".Input": {
        backgroundColor: bg,
        border: "1px solid " + border,
        boxShadow: "none",
        borderRadius: "6px",
        color: "var(--colorText)",
      },
      ".Input:autofill": {
        boxShadow: "none",
        // borderRadius: "6px",
        color: "var(--colorText)",
        backgroundColor: "#000000 !important",
        border: "1px solid " + border,
      },
      "..Input-webkit-text-fill-color": {
        color: "var(--colorText)",
      },
    },
  };
};

export function isSubscriptionCancellingInNext3Days(
  subscription: Stripe.Subscription,
): boolean {
  // Get the current timestamp in seconds
  const nowInSeconds = Math.floor(Date.now() / 1000); // Convert milliseconds to seconds
  // Calculate the timestamp for three days from now
  const threeDaysInSeconds = 3 * 24 * 60 * 60; // 3 days in seconds
  const threeDaysFromNow = nowInSeconds + threeDaysInSeconds;

  // Check if cancel_at is set and is within the next three days
  if (subscription.cancel_at && subscription.cancel_at <= threeDaysFromNow) {
    return true;
  }

  // Otherwise, check if the subscription is set to cancel at the period end and the period end is within the next three days
  return (
    subscription.cancel_at_period_end &&
    subscription.current_period_end <= threeDaysFromNow
  );
}
