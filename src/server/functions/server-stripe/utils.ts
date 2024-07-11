import type { NextApiRequest, NextApiResponse } from "next";
import type Stripe from "stripe";
import { isAccessPassSubscription } from "@/src/client-functions/client-access-pass/utils";
import {
  additionalStorage,
  standardPlanPriceIds,
} from "@/src/client-functions/client-stripe/price-id-manager";
import type { IncludeType } from "@/src/utils/stripe-types";
import { stripe } from "../../singletons/stripe";
import { hasRole } from "../server-role";
import { getCurrentInstitution } from "../server-user";
import { getInstitutionStripeAccount } from "./db-requests";
import { getOrCreateStripeAccountForInstitution } from "./index";
import { getScheduleIdIfNotExists } from "./schedule-logic";

export function isInvoiceMetered(invoice: Stripe.Invoice) {
  return invoice.lines.data[0]?.plan?.usage_type === "metered";
}

function getCurrentPhase(
  subscriptionSchedule: Stripe.SubscriptionSchedule,
  time: number,
) {
  const now = time ? time : Math.floor(Date.now() / 1000);
  for (const phase of subscriptionSchedule.phases) {
    if (phase.start_date <= now && phase.end_date >= now) {
      return phase;
    }
  }
  return null;
}

export type PromoCodeRequestObject = {
  promoCode: string;
};

export function isStripeInvoice(
  invoice:
    | Stripe.Invoice
    | Stripe.UpcomingInvoice
    // | CustomGeneratedInvoice
    | string
    | null,
): invoice is Stripe.Invoice {
  return (invoice as Stripe.Invoice).object === "invoice";
}

export function isStripePaymentIntent(
  paymentIntent: Stripe.PaymentIntent | string | null,
): paymentIntent is Stripe.PaymentIntent {
  return (paymentIntent as Stripe.PaymentIntent).object === "payment_intent";
}

export const getScheduleIdAndCurrentPhase = async (
  subscription: Stripe.Subscription,
) => {
  const scheduleId = await getScheduleIdIfNotExists(subscription);
  const sched = (await stripe.subscriptionSchedules.retrieve(
    scheduleId,
  )) as Stripe.SubscriptionSchedule;
  let time;
  if (subscription.test_clock) {
    const clock: Stripe.TestHelpers.TestClock =
      await stripe.testHelpers.testClocks.retrieve(
        subscription.test_clock as string,
      );
    time = clock.frozen_time;
  }
  const currentPhase = getCurrentPhase(sched, time);
  return { currentPhase, scheduleId };
};

export const getStripeAccountIfAuthorized = async ({
  userId,
  createNewStripeAccount,
  include,
  req,
  res,
}: {
  userId: string;
  createNewStripeAccount?: boolean;
  include?: IncludeType;
  req: NextApiRequest;
  res: NextApiResponse;
}) => {
  const institution = await getCurrentInstitution(userId!);
  if (!institution)
    return {
      status: 400,
      message: "No institution selected",
      stripeAccount: null,
    };
  const { status, message } = await checkAdminRole(
    userId!,
    institution.id,
    res,
  );
  if (status || message) return { status, message, stripeAccount: null };
  if (createNewStripeAccount) {
    const stripeAccount = await getOrCreateStripeAccountForInstitution({
      institutionId: institution?.id,
      institutionName: institution?.name,
      userId,
      include,
    });
    return {
      status: undefined,
      message: undefined,
      stripeAccount: stripeAccount,
      institutionId: institution.id,
    };
  }
  const stripeAccount = await getInstitutionStripeAccount(
    institution.id,
    include,
  );
  return {
    status: undefined,
    message: undefined,
    stripeAccount,
    institutionId: institution.id,
  };
};

export const checkAdminRole = async (
  userId: string,
  institutionId: string,
  res: NextApiResponse,
) => {
  if (
    !(await hasRole({
      userId: userId!,
      layerId: institutionId,
      institutionId,
      role: "admin",
    }))
  ) {
    return {
      status: 400,
      message: "Unauthorized",
      stripeAccount: null,
      institutionId: null,
    };
  }
  return { status: null, message: null };
};

export function determineTaxIdType(
  countryCode: string,
  taxId: string,
): Stripe.TaxIdCreateParams.Type | null {
  const taxIdFormats = taxIdFormatMap.get(countryCode.toUpperCase());
  if (!taxIdFormats) {
    throw new Error(`Unknown country code: ${countryCode}`);
  }
  for (const taxIdFormat of taxIdFormats) {
    if (taxIdFormat.pattern.test(taxId)) {
      return taxIdFormat.id;
    }
  }
  return null;
}

export function isCurrentTimeWithinRange(start: number, end: number): boolean {
  // Get the current Unix timestamp in seconds
  const now: number = Math.floor(Date.now() / 1000);
  // ‚
  // Check if the current time is within the given range
  if (now >= start && now <= end) {
    return true;
  } else {
    return false;
  }
}

export function isCloserThanXPercent(
  percentage: number,
  num1: number,
  num2: number,
): boolean {
  const threshold = num2 * (1 - percentage / 100);
  return num1 >= threshold && num1 < num2;
}

export const getSubscriptionType = (
  subscription: Stripe.Subscription,
): "accessPass" | "stripeAccount" | "addOn" | "old-price-id" | "storage" => {
  if (isAccessPassSubscription(subscription)) {
    return "accessPass";
  } else if (isInstitutionStripeAccountSubscription(subscription)) {
    return "stripeAccount";
  } else if (hasIgnoredPriceId(subscription)) return "old-price-id";
  else if (isStorageSubscription(subscription)) {
    return "storage";
  } else {
    throw new Error(
      "Cannot find subscription type for subscription" +
        JSON.stringify(subscription),
    );
  }
};

export const isStorageSubscription = (subscription: Stripe.Subscription) => {
  return subscription.items.data[0]?.price.id === additionalStorage;
};

export const hasIgnoredPriceId = (subscription: Stripe.Subscription) => {
  const priceId = subscription.items?.data[0]?.price.id;
  return [
    "price_1MQpHIEwHpTUe8W7PrKtEkoB",
    "price_1N5sN8EwHpTUe8W7mjL7lHqF",
  ].includes(priceId as string);
};
export function isInstitutionStripeAccountSubscription(
  subscription: Stripe.Subscription,
) {
  if (
    subscription.items.data[0]?.price.id &&
    standardPlanPriceIds.includes(subscription.items.data[0]?.price.id)
  ) {
    return true;
  } else return false;
}

export function isCustomer(obj: any): obj is Stripe.Customer {
  return obj && obj.address !== undefined;
}

export function getLowestNumber(array: number[]): number {
  return Math.min(...array);
}

export type TaxIdFormat = {
  pattern: RegExp;
  id: Stripe.TaxIdCreateParams.Type;
};
export const taxIdFormatMap: Map<string, TaxIdFormat[]> = new Map([
  [
    "AU",
    [
      { pattern: /^[0-9]{11}$/, id: "au_abn" },
      { pattern: /^[0-9]{12}$/, id: "au_arn" },
    ],
  ],
  ["AT", [{ pattern: /^ATU[0-9]{8}$/, id: "eu_vat" }]],
  [
    "UK",
    [
      { pattern: /^XI[0-9]{9}$/, id: "eu_vat" },
      { pattern: /^GB[0-9]{9}$/, id: "gb_vat" },
    ],
  ],
  ["BE", [{ pattern: /^BE0[0-9]{9}$/, id: "eu_vat" }]],
  [
    "BR",
    [
      {
        pattern: /^[0-9]{2}\.[0-9]{3}\.[0-9]{3}\/[0-9]{4}-[0-9]{2}$/,
        id: "br_cnpj",
      },
      { pattern: /^[0-9]{3}\.[0-9]{3}\.[0-9]{3}-[0-9]{2}$/, id: "br_cpf" },
    ],
  ],
  [
    "BG",
    [
      { pattern: /^[0-9]{9}$/, id: "bg_uic" },
      { pattern: /^BG0[0-9]{9}$/, id: "eu_vat" },
    ],
  ],
  [
    "CA",
    [
      { pattern: /^[0-9]{9}$/, id: "ca_bn" },
      { pattern: /^[0-9]{9}RT[0-9]{4}$/, id: "ca_gst_hst" },
      { pattern: /^PST-[0-9]{4}-[0-9]{4}$/, id: "ca_pst_bc" },
      { pattern: /^[0-9]{6}-[0-9]{1}$/, id: "ca_pst_mb" },
      { pattern: /^[0-9]{7}$/, id: "ca_pst_sk" },
      { pattern: /^[0-9]{10}TQ[0-9]{4}$/, id: "ca_qst" },
    ],
  ],
  [
    "CL",
    [{ pattern: /^[0-9]{2}\.[0-9]{3}\.[0-9]{3}-[K0-9]{1}$/, id: "cl_tin" }],
  ],
  ["HR", [{ pattern: /^HR[0-9]{11}$/, id: "eu_vat" }]],
  ["CY", [{ pattern: /^CY[0-9]{8}[Z0-9]{1}$/, id: "eu_vat" }]],
  ["CZ", [{ pattern: /^CZ[0-9]{10}$/, id: "eu_vat" }]],
  ["DK", [{ pattern: /^DK[0-9]{8}$/, id: "eu_vat" }]],
  ["EG", [{ pattern: /^[0-9]{9}$/, id: "eg_tin" }]],
  ["EE", [{ pattern: /^EE[0-9]{9}$/, id: "eu_vat" }]],
  ["EU", [{ pattern: /^EU[0-9]{9}$/, id: "eu_oss_vat" }]],
  ["FI", [{ pattern: /^FI[0-9]{8}$/, id: "eu_vat" }]],
  [
    "FR",
    [{ pattern: /^FR[A-HJ-NP-Z0-9][A-HJ-NP-Z0-9][0-9]{9}$/, id: "eu_vat" }],
  ], // it could be more complex for france
  ["GE", [{ pattern: /^[0-9]{9}$/, id: "ge_vat" }]],
  ["DE", [{ pattern: /^DE[0-9]{9}$/, id: "eu_vat" }]],
  ["GR", [{ pattern: /^EL[0-9]{9}$/, id: "eu_vat" }]],
  ["HK", [{ pattern: /^[0-9]{8}$/, id: "hk_br" }]],
  [
    "HU",
    [
      { pattern: /^HU[0-9]{8}$/, id: "eu_vat" },
      { pattern: /^[0-9]{8}-[0-9]-[0-9]{2}$/, id: "hu_tin" },
    ],
  ],
  ["IS", [{ pattern: /^[0-9]{6}$/, id: "is_vat" }]],
  [
    "IN",
    [
      {
        pattern: /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[0-9]{1}[A-Z]{1}[0-9]{1}$/,
        id: "in_gst",
      },
    ],
  ],
  [
    "ID",
    [
      {
        pattern: /^[0-9]{2}\.[0-9]{3}\.[0-9]{3}\.[0-9]-[0-9]{3}\.[0-9]{3}$/,
        id: "id_npwp",
      },
    ],
  ],
  ["IE", [{ pattern: /^IE[0-9]{7}[A-Z]{1,2}$/, id: "eu_vat" }]],
  ["IL", [{ pattern: /^[0-9]{9}$/, id: "il_vat" }]],
  ["IT", [{ pattern: /^IT[0-9]{11}$/, id: "eu_vat" }]],
  [
    "JP",
    [
      { pattern: /^[0-9]{13}$/, id: "jp_cn" },
      { pattern: /^[0-9]{5}$/, id: "jp_rn" },
      { pattern: /^T[0-9]{13}$/, id: "jp_trn" },
    ],
  ],
  ["KE", [{ pattern: /^P[0-9]{9}[A-Z]$/, id: "ke_pin" }]],
  ["LV", [{ pattern: /^LV[0-9]{11}$/, id: "eu_vat" }]],
  ["LI", [{ pattern: /^CHE[0-9]{9}$/, id: "li_uid" }]],
  ["LT", [{ pattern: /^LT[0-9]{12}$/, id: "eu_vat" }]],
  ["LU", [{ pattern: /^LU[0-9]{8}$/, id: "eu_vat" }]],
  [
    "MY",
    [
      { pattern: /^[0-9]{8}$/, id: "my_frp" },
      { pattern: /^C [0-9]{10}$/, id: "my_itn" },
      { pattern: /^A[0-9]{2}-[0-9]{4}-[0-9]{8}$/, id: "my_sst" },
    ],
  ],
  ["MT", [{ pattern: /^MT[0-9]{8}$/, id: "eu_vat" }]],
  ["MX", [{ pattern: /^[A-Z]{3}[0-9]{6}[A-Z0-9]{3}$/, id: "mx_rfc" }]],
  ["NL", [{ pattern: /^NL[0-9]{9}B[0-9]{2}$/, id: "eu_vat" }]],
  ["NZ", [{ pattern: /^[0-9]{9}$/, id: "nz_gst" }]],
  ["NO", [{ pattern: /^[0-9]{9}MVA$/, id: "no_vat" }]],
  ["PH", [{ pattern: /^[0-9]{12}$/, id: "ph_tin" }]],
  ["PL", [{ pattern: /^PL[0-9]{10}$/, id: "eu_vat" }]],
  ["PT", [{ pattern: /^PT[0-9]{9}$/, id: "eu_vat" }]],
  ["RO", [{ pattern: /^RO[0-9]{2,10}$/, id: "eu_vat" }]],
  [
    "RU",
    [
      { pattern: /^[0-9]{10}$/, id: "ru_inn" },
      { pattern: /^[0-9]{9}$/, id: "ru_kpp" },
    ],
  ],
  ["SA", [{ pattern: /^[0-9]{15}$/, id: "sa_vat" }]],
  [
    "SG",
    [
      { pattern: /^M[0-9]{8}[A-Z]$/, id: "sg_gst" },
      { pattern: /^[0-9]{9}[A-Z]$/, id: "sg_uen" },
    ],
  ],
  ["SK", [{ pattern: /^SK[0-9]{10}$/, id: "eu_vat" }]],
  [
    "SI",
    [
      { pattern: /^SI[0-9]{8}$/, id: "eu_vat" },
      { pattern: /^[0-9]{8}$/, id: "si_tin" },
    ],
  ],
  ["ZA", [{ pattern: /^[0-9]{10}$/, id: "za_vat" }]],
  ["KR", [{ pattern: /^[0-9]{3}-[0-9]{2}-[0-9]{5}$/, id: "kr_brn" }]],
  [
    "ES",
    [
      { pattern: /^[A-Z][0-9]{8}$/, id: "es_cif" },
      { pattern: /^ESA[0-9]{7}[A-Z]$/, id: "eu_vat" },
    ],
  ],
  ["SE", [{ pattern: /^SE[0-9]{12}$/, id: "eu_vat" }]],
  ["CH", [{ pattern: /^CHE-123.456.789 MWST$/, id: "ch_vat" }]],
  ["TW", [{ pattern: /^[0-9]{8}$/, id: "tw_vat" }]],
  ["TH", [{ pattern: /^[0-9]{13}$/, id: "th_vat" }]],
  ["TR", [{ pattern: /^[0-9]{10}$/, id: "tr_tin" }]],
  ["UA", [{ pattern: /^[0-9]{9}$/, id: "ua_vat" }]],
  ["AE", [{ pattern: /^[0-9]{15}$/, id: "ae_trn" }]],
  ["US", [{ pattern: /^[0-9]{2}-[0-9]{7}$/, id: "us_ein" }]],
]);
