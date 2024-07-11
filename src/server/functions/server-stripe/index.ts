import type { InstitutionStripeAccount, User } from "@prisma/client";
import cuid from "cuid";
import type Stripe from "stripe";
import {
  getSupportPackageNameFromValue,
  taxRate,
} from "@/src/client-functions/client-stripe/price-id-manager";
import type { Discount } from "@/src/components/admin-dashboard/top-right-menu/zustand";
import type { StripeAccountInfo } from "@/src/types/user-data.types";
import type {
  CouponCreateData,
  CreateBillingPortalSessionData,
  CreateSubscriptionData,
  FuxamStripeSubscription,
  IncludeType,
  StripeAccountWithSupportPackage,
  SubscriptionStatusInfo,
  UpdateCustomerInformationData,
  UpdateSubscriptionData,
} from "@/src/utils/stripe-types";
import { sentry } from "../../singletons/sentry";
import { stripe } from "../../singletons/stripe";
import { getUpcomingAccessPassInvoices } from "../server-access-passes";
import { getInstitutionSettings } from "../server-institution-settings";
import { getCurrentInstitution, getUser } from "../server-user";
import {
  getAdminsOfInstitution,
  getTotalActiveUsersOfInstitution,
} from "./../server-role";
import { determineTaxIdType } from "./../server-stripe/utils";
import {
  getInstitutionStripeAccount,
  linkStripeCustomerToInstitution,
} from "./db-requests";
import {
  getScheduleIdIfNotExists,
  runCorrectUpdateProcedure,
} from "./schedule-logic";

// retrieves a Stripe customer id for a given institution if it exists or creates a new one
export async function getOrCreateStripeAccountForInstitution(args: {
  institutionId: string;
  institutionName: string;
  userId: string;
  accessPassCouponId?: string;
  mainSubscriptionCouponId?: string;
  user?: User;
  include?: IncludeType;
  potentialStripeAccount?: InstitutionStripeAccount;
}) {
  const {
    institutionId,
    institutionName,
    userId,
    include,
    user,
    potentialStripeAccount,
    accessPassCouponId,
    mainSubscriptionCouponId,
  } = args;

  sentry.addBreadcrumb({
    message: "stripe - getOrCreateStripeAccountForInstitution",
    data: args,
  });

  if (potentialStripeAccount && potentialStripeAccount.customerId) {
    return potentialStripeAccount;
  }

  const [admins, stripeAccount] = await Promise.all([
    getAdminsOfInstitution(institutionId),
    getInstitutionStripeAccount(institutionId, include),
  ]);
  if (!stripeAccount || !stripeAccount.customerId) {
    const userObject = user ? user : await getUser(userId);
    if (userObject?.email) {
      sentry.addBreadcrumb({
        message: "Creating new Stripe Customer",
        data: user,
      });

      return await createStripeCustomerAndLinkToInstitution({
        admins,
        user: user!,
        institutionId,
        institutionName,
        accessPassCouponId,
        mainSubscriptionCouponId,
      });
    }
  } else {
    return stripeAccount;
  }
}

export async function createStripeCustomerAndLinkToInstitution({
  admins,
  user,
  institutionId,
  institutionName,
  accessPassCouponId,
  mainSubscriptionCouponId,
}: {
  admins: User[];
  user: User;
  institutionId: string;
  institutionName: string;
  accessPassCouponId?: string;
  mainSubscriptionCouponId?: string;
}) {
  const customer = await createStripeCustomer(
    admins,
    user?.email,
    institutionId,
    institutionName,
  );

  const updatedInstitution = await linkStripeCustomerToInstitution({
    institutionId,
    customerId: customer.id,
    accessPassCouponId,
    mainSubscriptionCouponId,
  });
  if (updatedInstitution.stripeAccount?.customerId) {
    return updatedInstitution.stripeAccount;
  } else {
    throw new Error("Could not create customer.");
  }
}

export async function updateCustomer(
  customerId: string,
  updateParams: Stripe.CustomerUpdateParams,
) {
  return await stripe.customers.update(customerId, updateParams);
}

export async function updateTrialCustomers(
  userId: string,
  stripeAccount: InstitutionStripeAccount,
) {
  const [sub, user, institution, adminsOfInstitution] = await Promise.all([
    getSubscription(stripeAccount),
    getUser(userId),
    getCurrentInstitution(userId!),
    getAdminsOfInstitution(stripeAccount.institutionId),
  ]);

  if (sub.metadata.isTestInstitution === "true" && institution) {
    user &&
      (await createStripeCustomerAndLinkToInstitution({
        admins: adminsOfInstitution,
        user,
        institutionId: institution.id,
        institutionName: institution.name,
      }));
  }
}

export async function createStripeCustomer(
  admins: User[],
  userEmail: string | null,
  institutionId: string | null,
  institutionName: string | null,
) {
  const adminEmails = admins.map((admin) => admin.email);
  let testClock;
  // if (SELECT_ENVIRONMENT_HERE === "dev") {
  //   testClock = await stripe.testHelpers.testClocks.create({
  //     frozen_time: Math.floor(new Date().getTime() / 1000),
  //     name: "Test Clock - " + new Date().getTime(),
  //   });
  // }
  if (!institutionId)
    throw new Error("Can't create customer without institutionId");
  const { institution_language } = await getInstitutionSettings(institutionId);
  return await stripe.customers.create({
    email: userEmail ?? undefined,
    preferred_locales: [institution_language === "en" ? "en-US" : "de"],
    metadata: {
      institutionId,
      institutionName,
      adminEmails: JSON.stringify(adminEmails),
    },
    ...(testClock ? { test_clock: testClock?.id } : {}),
  });
}

export async function updateCustomerCompanyName(
  stripeAccount: InstitutionStripeAccount,
  data?: { companyName: string },
) {
  return await stripe.customers.update(stripeAccount.customerId as string, {
    name: data?.companyName,
    metadata: {
      companyName: data?.companyName as string,
    },
  });
}

export async function getCustomerAndTaxId(
  stripeAccount: InstitutionStripeAccount,
) {
  const { customerId } = stripeAccount;
  const [customer, taxId] = await Promise.all([
    retrieveCustomer(customerId!),
    stripe.customers.listTaxIds(customerId!),
  ]);
  return { customer: customer, taxIds: taxId };
}

export async function updateSubscriptionPaymentMethod(
  stripeAccount: InstitutionStripeAccount,
  data?: { payMethodId: string },
) {
  await stripe.customers.update(stripeAccount.customerId!, {
    invoice_settings: {
      default_payment_method: data?.payMethodId,
    },
  });
  const subscription = await stripe.subscriptions.update(
    stripeAccount.subscriptionId!,
    {
      default_payment_method: data?.payMethodId,
      expand: ["schedule.phases", "latest_invoice.payment_intent"],
    },
  );
  return convertToFuxamStripeSubscription(subscription);
}

export async function getUserQuantityInformation(
  institutionId: string,
  subscriptionId?: string,
) {
  let finalSubscriptionId: string | null | undefined = subscriptionId;
  if (!subscriptionId) {
    const stripeAccount = await getInstitutionStripeAccount(institutionId);
    finalSubscriptionId = stripeAccount?.subscriptionId;
  }
  if (!finalSubscriptionId) throw new Error("No subscription id found!");
  const subscription = await stripe.subscriptions.retrieve(finalSubscriptionId);
  const selectedSubscriptionQuantity = subscription?.items?.data[0]
    ?.quantity as number;
  const totalNormalUsers = await getTotalActiveUsersOfInstitution(
    institutionId,
    false,
  );
  const willExceedMaxUsersIfOneMoreIsAdded =
    totalNormalUsers + 1 > selectedSubscriptionQuantity;
  return {
    subscription,
    selectedSubscriptionQuantity,
    totalNormalUsers,
    willExceedMaxUsersIfOneMoreIsAdded,
  };
}

export async function sendUsageReport(
  subscriptionItemId: string,
  quantity: number,
  idempotencyKey: string,
) {
  const res = await stripe.subscriptionItems.createUsageRecord(
    subscriptionItemId,
    {
      quantity,
      action: "set",
    },
    { idempotencyKey },
  );
  return res;
}

export async function reactivateSubscription(
  stripeAccount: InstitutionStripeAccount,
) {
  const { subscriptionId } = stripeAccount;
  if (subscriptionId) {
    const isTestInstitution =
      await subscriptionIsFromTestInstitution(subscriptionId);
    if (!isTestInstitution) {
      const subscription = await stripe.subscriptions.update(subscriptionId, {
        cancel_at_period_end: false,
      });
      return convertToFuxamStripeSubscription(subscription);
    }
  }
}

export async function cancelSubscription(
  stripeAccount: InstitutionStripeAccount,
) {
  if (stripeAccount?.subscriptionId) {
    const subscription = await stripe.subscriptions.retrieve(
      stripeAccount.subscriptionId,
    );
    const scheduleId = await getScheduleIdIfNotExists(subscription);
    await stripe.subscriptionSchedules.release(scheduleId);
    return convertToFuxamStripeSubscription(
      await stripe.subscriptions.update(stripeAccount.subscriptionId, {
        cancel_at_period_end: true,
      }),
    );
  }
}

export async function subscriptionIsFromTestInstitution(
  subscriptionId: string,
) {
  const subscription = (await stripe.subscriptions.retrieve(
    subscriptionId,
  )) as Stripe.Subscription;
  return subscription.metadata.isTestInstitution === "true";
}

export async function getPaymentMethods(
  stripeAccount: InstitutionStripeAccount,
) {
  if (stripeAccount && stripeAccount.customerId) {
    return await stripe.paymentMethods.list({
      customer: stripeAccount.customerId,
    });
  } else {
    throw new Error("No Customer Id found");
  }
}

export async function getSubscription(stripeAccount: InstitutionStripeAccount) {
  const { subscriptionId } = stripeAccount;
  try {
    if (subscriptionId) {
      const subscription = await stripe.subscriptions.retrieve(subscriptionId, {
        expand: ["schedule.phases", "latest_invoice.payment_intent"],
      });
      return subscription;
    } else {
      throw new Error("No Subscription Id found");
    }
  } catch (e) {
    const err = e as Error;
    throw new Error(err.message);
  }
}

export async function getUserDataStripeAccountInfo(
  institutionId: string,
): Promise<StripeAccountInfo | null> {
  sentry.addBreadcrumb({
    message: "Getting stripe account info",
    data: { institutionId },
  });
  const stripeAccount: StripeAccountWithSupportPackage =
    await getInstitutionStripeAccount(institutionId, ["supportPackage"]);
  if (!stripeAccount?.subscriptionId) return null;
  const subscription = await getSubscription(stripeAccount);
  sentry.addBreadcrumb({
    message: "Got stripe account info",
    data: { stripeAccount, subscription },
  });
  return {
    supportPackage: stripeAccount?.supportPackage
      ? (getSupportPackageNameFromValue(
          stripeAccount?.supportPackage,
        ) as string)
      : "none",
    subscription: convertToFuxamStripeSubscription(subscription),
  };
}

export const getStorageSubscription = async (
  stripeAccount: InstitutionStripeAccount,
) => {
  if (!stripeAccount.storageSubscriptionId) return null;
  const subscription = await stripe.subscriptions.retrieve(
    stripeAccount.storageSubscriptionId as string,
  );
  return convertToFuxamStripeSubscription(subscription);
};

export async function validatePromoCode(data: { promoCode?: string }) {
  if (!data.promoCode) return null;
  const promotionCodes = await stripe.promotionCodes.list({
    limit: 1,
    code: data.promoCode,
  });

  return promotionCodes.data[0]?.coupon || null;
}

export async function getCoupon(data: { couponId?: string }) {
  if (!data.couponId) return null;
  return await stripe.coupons.retrieve(data.couponId);
}

export async function listInvoices(customerId: string) {
  return await stripe.invoices.list({
    customer: customerId,
    expand: ["data.subscription", "data.payment_intent"],
  });
}

export async function getUpcomingInvoice(
  subscriptionId: string,
  customerId: string,
) {
  try {
    const res = await stripe.invoices.retrieveUpcoming({
      subscription: subscriptionId,
      customer: customerId,
      expand: ["subscription"],
    });
    return res;
  } catch (e) {
    console.error(e);
  }
}

export async function getUpcomingAddOnInvoices(
  stripeAccount: InstitutionStripeAccount | any,
) {
  if (stripeAccount.paidAddOns) {
    const promises: Promise<any>[] = [];
    try {
      for (const addOn of stripeAccount.paidAddOns) {
        if (addOn.addOnSubscriptionId) {
          promises.push(
            getUpcomingInvoice(addOn.addOnSubscriptionId, addOn.customerId),
          );
        }
      }
      const [result] = await Promise.all(promises);
      return result;
    } catch (e) {
      // console.error((e as Error).name)
    }
  }
  return;
}
const buggyJSON = {
  id: "in_1OFkTHEwHpTUe8W7GhV6SBmd",
  object: "invoice",
  account_country: "DE",
  account_name: "Fuxam GmbH",
  account_tax_ids: ["atxi_1OFha7EwHpTUe8W7RH2BvkN6"],
  amount_due: 0,
  amount_paid: 0,
  amount_remaining: 0,
  amount_shipping: 0,
  application: null,
  application_fee_amount: null,
  attempt_count: 0,
  attempted: false,
  auto_advance: false,
  automatic_tax: {
    enabled: false,
    status: null,
  },
  billing_reason: "manual",
  charge: null,
  collection_method: "send_invoice",
  created: 1700775003,
  currency: "eur",
  custom_fields: null,
  customer: "cus_P0QfnHo5b38NVk",
  customer_address: {
    city: "Dortmund",
    country: "DE",
    line1: "Huckarder Straße 12",
    line2: null,
    postal_code: "44147",
    state: null,
  },
  customer_email: "beautyfineconcept@gmail.com",
  customer_name: "Daisy N. Horn",
  customer_phone: "+4915736473283",
  customer_shipping: null,
  customer_tax_exempt: "none",
  customer_tax_ids: [],
  default_payment_method: null,
  default_source: null,
  default_tax_rates: [],
  description: "SteuerID: DE351407028\n\nVielen Dank für Ihr Vertrauen!",
  discount: null,
  discounts: [],
  due_date: 1703367003,
  effective_at: null,
  ending_balance: null,
  footer:
    "SteuerID: DE351407028\n\nIf you need help with your payment or invoice, please contact support@fuxam.de.",
  from_invoice: null,
  hosted_invoice_url: null,
  invoice_pdf: null,
  last_finalization_error: null,
  latest_revision: null,
  lines: {
    object: "list",
    data: [],
    has_more: false,
    total_count: 0,
    url: "/v1/invoices/in_1OFkTHEwHpTUe8W7GhV6SBmd/lines",
  },
  livemode: true,
  metadata: {},
  next_payment_attempt: null,
  number: null,
  on_behalf_of: null,
  paid: false,
  paid_out_of_band: false,
  payment_intent: null,
  payment_settings: {
    default_mandate: null,
    payment_method_options: null,
    payment_method_types: null,
  },
  period_end: 1731603225,
  period_start: 1699980825,
  post_payment_credit_notes_amount: 0,
  pre_payment_credit_notes_amount: 0,
  quote: null,
  receipt_number: null,
  rendering: {
    amount_tax_display: null,
    pdf: {
      page_size: "auto",
    },
  },
  rendering_options: null,
  shipping_cost: null,
  shipping_details: null,
  starting_balance: 0,
  statement_descriptor: null,
  status: "draft",
  status_transitions: {
    finalized_at: null,
    marked_uncollectible_at: null,
    paid_at: null,
    voided_at: null,
  },
  subscription: null,
  subscription_details: {
    metadata: null,
  },
  subtotal: 0,
  subtotal_excluding_tax: 0,
  tax: null,
  test_clock: null,
  total: 0,
  total_discount_amounts: [],
  total_excluding_tax: 0,
  total_tax_amounts: [],
  transfer_data: null,
  webhooks_delivered_at: 1700775005,
};

export async function getInvoices(stripeAccount: InstitutionStripeAccount) {
  const { subscriptionId, customerId } = stripeAccount;

  if (!subscriptionId || typeof subscriptionId !== "string") {
    throw new TypeError("Invalid subscription ID");
  }
  if (!customerId || typeof customerId !== "string") {
    throw new TypeError("Invalid customer ID");
  }
  const accessPasses = (stripeAccount as any).accessPasses;
  const [
    invoices,
    upcomingInvoice,
    upcomingAddOnInvoice,
    upcomingAccessPassInvoices,
  ] = await Promise.all([
    listInvoices(customerId),
    getUpcomingInvoice(subscriptionId, customerId),
    getUpcomingAddOnInvoices(stripeAccount),
    accessPasses && getUpcomingAccessPassInvoices(accessPasses, customerId),
  ]);
  let res: (Stripe.Invoice | Stripe.UpcomingInvoice)[] = invoices.data;
  if (upcomingInvoice) res = [upcomingInvoice, ...res];
  if (upcomingAddOnInvoice) res = [upcomingAddOnInvoice, ...res];
  if (upcomingAccessPassInvoices) res = [...upcomingAccessPassInvoices, ...res];
  return res;
}

export async function getUpcomingInvoiceIfActiveSubscription(
  subscription: Stripe.Subscription,
  customerId: string,
) {
  let upcomingInvoice;
  if (subscription && subscription.status !== "canceled") {
    upcomingInvoice = await getUpcomingInvoice(subscription.id, customerId);
  }
}

export async function checkIfSubscriptionIdExists(institutionId: string) {
  const stripeAcc = await getInstitutionStripeAccount(institutionId);
  return stripeAcc?.subscriptionId;
}

export function getSubscriptionStatus(
  stripeAcc: InstitutionStripeAccount,
  subscription: Stripe.Subscription,
) {
  return {
    active: stripeAcc.subscriptionStatus === "active",
    status: stripeAcc.subscriptionStatus,
    subscription,
  };
}

export async function checkInstitutionSubscriptionStatus(
  stripeAcc?: InstitutionStripeAccount,
): Promise<SubscriptionStatusInfo> {
  if (!stripeAcc) {
    return { active: false, status: null, subscription: null };
  }
  try {
    if (stripeAcc && stripeAcc?.subscriptionId) {
      const subscription = await getSubscription(stripeAcc);
      return getSubscriptionStatus(stripeAcc, subscription);
    }
    return { active: false, status: null, subscription: null };
  } catch (e) {
    throw new Error((e as Error).message);
  }
}

export async function retrieveSubscription(
  subscriptionId: string,
  expand?: string[],
) {
  return await stripe.subscriptions.retrieve(subscriptionId, {
    expand: expand,
  });
}

export async function updateSubscriptionOrSchedule(
  stripeAccount: InstitutionStripeAccount,
  data?: UpdateSubscriptionData,
) {
  const { subscriptionId } = stripeAccount;

  if (!subscriptionId) throw new Error("No Subscription Id found");
  const subscription = await retrieveSubscription(subscriptionId);
  await runCorrectUpdateProcedure({
    subscription: subscription,
    newPrice: data?.priceId as string,
    newQuantity: data?.quantity as number,
    ...(data?.promoCode ? { promotionCode: data.promoCode } : {}),
  });
  return convertToFuxamStripeSubscription(
    await retrieveSubscription(subscriptionId, ["schedule.phases"]),
  );
}

export async function createSetupIntent(
  stripeAccount: InstitutionStripeAccount,
  data?: { userId: string },
) {
  if (stripeAccount.subscriptionId) {
    await updateTrialCustomers(data?.userId as string, stripeAccount);
  }
  const setupIntent = await stripe.setupIntents.create({
    customer: stripeAccount.customerId!,
    payment_method_types: ["card", "sepa_debit"],
  });
  if (setupIntent.client_secret) {
    return { clientSecret: setupIntent.client_secret };
  }
}

export async function updateSubscription({
  subscription,
  newPrice,
  newQuantity,
  couponId,
}: {
  subscription: Stripe.Subscription;
  newPrice: string;
  newQuantity: number;
  couponId?: string;
}) {
  return await stripe.subscriptions.update(subscription.id, {
    items: [
      {
        id: subscription.items.data[0]?.id,
        price: newPrice,
        quantity: newQuantity,
      },
    ],
    proration_behavior: "create_prorations",
    ...(couponId ? { coupon: couponId } : {}),
  });
}

export async function addCustomerMetadata({
  customerId,
  institutionName,
  institutionId,
}: {
  customerId: string;
  institutionName: string;
  institutionId: string;
}) {
  return await stripe.customers.update(customerId, {
    metadata: {
      institutionName,
      institutionId,
    },
  });
}
export async function createStandardSubscription(
  stripeAccount: InstitutionStripeAccount,
  data?: CreateSubscriptionData,
) {
  // Create the subscription. Note we're expanding the Subscription's
  // latest invoice and that invoice's payment_intent
  // so we can pass it to the front end to confirm the payment
  // const { priceId, quantity, promoCode, userId } = data;
  const { customerId } = stripeAccount;
  if (!customerId) throw new Error("No Customer Id found");
  await addCustomerMetadata({
    customerId,
    institutionId: stripeAccount.institutionId,
    institutionName: data?.institutionName as string,
  });

  sentry.addBreadcrumb({
    message: "stripe - createStandardSubscription",
    data: { customerId },
  });
  const mainSubCouponId = stripeAccount?.mainSubscriptionCouponId;
  const coupon = mainSubCouponId
    ? await stripe.coupons.retrieve(mainSubCouponId)
    : null;
  const checkoutSession = await stripe.checkout.sessions.create({
    customer: customerId as string,
    line_items: [
      {
        price: data?.standardSubscriptionItem.priceId,
        // price: "price_1N5sN8EwHpTUe8W7mjL7lHqF",
        quantity: data?.standardSubscriptionItem.quantity,
      },
      ...(data?.supportPackagePriceId
        ? [
            {
              price: data?.supportPackagePriceId,
              quantity: 1,
            },
          ]
        : []),
    ],
    ...(coupon
      ? {
          discounts: [
            {
              coupon: coupon.id,
            },
          ],
        }
      : { allow_promotion_codes: true }),
    saved_payment_method_options: {
      payment_method_save: "enabled",
      allow_redisplay_filters: ["always"],
    },

    subscription_data: {
      default_tax_rates: [taxRate],
      metadata: {
        institutionId: stripeAccount.institutionId,
        userId: data?.userId as string,
        hasReceived5PercentNotification: "false",
        hasReceived10PercentNotification: "false",
        hasReceived20PercentNotification: "false",
        hasReceivedMaxUserNotification: "false",
      },
    },
    customer_update: {
      name: "auto",
      address: "auto",
    },
    mode: "subscription",
    billing_address_collection: "required",
    phone_number_collection: { enabled: true },
    tax_id_collection: { enabled: true },
    // allow_promotion_codes: true,

    currency: "eur",
    consent_collection: {
      terms_of_service: "required",
    },
    success_url: data?.success_url as string,
    cancel_url: data?.cancel_url ?? `${process.env.SERVER_URL}`,
  });
  return checkoutSession.url;
}

export async function checkPaymentIntentStatus(
  stripeAccount: InstitutionStripeAccount,
) {
  const { subscriptionId } = stripeAccount;
  if (!subscriptionId) return null;
  const subscription = await retrieveSubscription(subscriptionId, [
    "latest_invoice.payment_intent",
  ]);
  const latestInvoice = subscription.latest_invoice as Stripe.Invoice;
  if (!latestInvoice.payment_intent) return null;
  const paymentIntent = latestInvoice.payment_intent as Stripe.PaymentIntent;
  return paymentIntent.status;
}

export async function updateCustomerInformation(
  stripeAccount: InstitutionStripeAccount,
  data?: UpdateCustomerInformationData,
) {
  const customerWithAddress = await stripe.customers.update(
    stripeAccount?.customerId as string,
    {
      address: data?.address,
      phone: data?.phone,
      metadata: {
        purchaserName: data?.name as string,
      },
    },
  );
  return customerWithAddress;
}

export async function retrieveCustomer(customerId: string) {
  if (!customerId) {
    throw new Error("Customer ID is required");
  }
  return await stripe.customers.retrieve(customerId);
}

export async function deleteOldCustomerTaxId(customerId: string) {
  const taxIds = await stripe.customers.listTaxIds(customerId);
  if (taxIds.data[0]) {
    await stripe.customers.deleteTaxId(customerId, taxIds.data[0].id);
  }
}

export async function createCustomerTaxId(
  customerId: string,
  taxId: string,
  taxIdType: Stripe.TaxIdCreateParams.Type,
) {
  if (taxIdType) {
    return await stripe.customers.createTaxId(customerId, {
      value: taxId,
      type: taxIdType,
    });
  }
}
export async function updateCustomerTaxId(
  stripeAccount: InstitutionStripeAccount,
  data?: { taxId?: string },
) {
  if (!data?.taxId) throw new Error("Tax ID is required");
  const customerId = stripeAccount.customerId as string;
  const customer = (await retrieveCustomer(customerId)) as Stripe.Customer;

  if (customer && customer.address && customer.address.country) {
    await deleteOldCustomerTaxId(customerId);

    const taxIdType = determineTaxIdType(customer.address.country, data.taxId);
    if (!taxIdType)
      throw new Error(
        "Could not match tax Id to your location. Please try again or contact us at https://fuxam.app/contact.",
      );

    const updatedCustomer = await createCustomerTaxId(
      customerId,
      data.taxId,
      taxIdType,
    );
    if (!updatedCustomer)
      throw new Error(
        "Invalid Tax ID or country mismatch detected. If incorrect, contact us at https://fuxam.com/contact.",
      );
    return updatedCustomer;
  }
  throw new Error("Your address or country is missing.");
}

export async function updateCustomerLanguage(
  stripeAccount: InstitutionStripeAccount,
  data?: { language?: Language },
) {
  const customerId = stripeAccount.customerId as string;
  if (!data?.language) throw new Error("Language is required");
  return await stripe.customers.update(customerId, {
    preferred_locales: [data?.language || "en"],
  });
}

export async function getUpcomingInvoicePreview(
  stripeAccount: InstitutionStripeAccount,
  data?: UpdateSubscriptionData,
) {
  const subscription = await stripe.subscriptions.retrieve(
    stripeAccount.subscriptionId as string,
  );
  return await getInstantUpgradeUpcomingInvoice(
    subscription,
    stripeAccount,
    data,
  );
}

export async function getInstantUpgradeUpcomingInvoice(
  subscription: Stripe.Subscription,
  stripeAccount: InstitutionStripeAccount,
  data?: UpdateSubscriptionData,
) {
  const { coupon, priceId } = await extrapolateUpdateData(subscription, data);
  const inv = await stripe.invoices.retrieveUpcoming({
    subscription: stripeAccount.subscriptionId as string,
    subscription_items: [
      {
        id: subscription.items.data[0]?.id,
        price: priceId,
        quantity: data?.quantity,
      },
    ],
    subscription_proration_date: Math.floor(new Date().getTime() / 1000),
    subscription_proration_behavior: "create_prorations",
    ...(coupon && coupon.id ? { coupon: coupon.id } : {}),
    expand: ["total_tax_amounts.tax_rate", "total_discount_amounts.discount"],
  });
  return inv;
}

export async function extrapolateUpdateData(
  subscription: Stripe.Subscription,
  data?: UpdateSubscriptionData,
) {
  const coupon = data?.promoCode
    ? await validatePromoCode({ promoCode: data.promoCode })
    : { id: subscription.discount?.coupon.id };
  const priceId =
    subscription.items.data[0]?.price.id === data?.priceId
      ? undefined
      : data?.priceId;
  return { subscription, coupon, priceId };
}

export async function checkSubscriptionHasSpaceFor1MoreUser({
  institutionId,
}: {
  institutionId: string;
}) {
  const [totalActiveNormalUsers, stripeAcc] = await Promise.all([
    getTotalActiveUsersOfInstitution(institutionId, false),
    getInstitutionStripeAccount(institutionId),
  ]);
  if (!stripeAcc?.subscriptionId) return false;
  const subscription = await stripe.subscriptions.retrieve(
    stripeAcc.subscriptionId as string,
  );
  return (
    totalActiveNormalUsers + 1 <=
    (subscription.items.data[0]?.quantity as number)
  );
}

export async function checkSubscriptionHasSpaceForMoreUsers(
  institutionId: string,
  count: number,
) {
  const [totalActiveNormalUsers, stripeAcc] = await Promise.all([
    getTotalActiveUsersOfInstitution(institutionId, false),
    getInstitutionStripeAccount(institutionId),
  ]);
  const subscription = await stripe.subscriptions.retrieve(
    stripeAcc?.subscriptionId as string,
  );

  return (
    totalActiveNormalUsers + count <=
    (subscription.items.data[0]?.quantity as number)
  );
}

export function convertToFuxamStripeSubscription(
  subscription: Stripe.Subscription,
): FuxamStripeSubscription | undefined {
  if (!subscription) return undefined;
  const latestInvoice = subscription.latest_invoice as Stripe.Invoice;
  const lastPaymentIntent =
    latestInvoice?.payment_intent as Stripe.PaymentIntent;
  const schedule = subscription.schedule as
    | Stripe.SubscriptionSchedule
    | undefined;

  const price = subscription.items.data[0]?.price as Stripe.Price;
  return {
    id: subscription.id,
    status: subscription.status,
    current_period_end: subscription.current_period_end,
    priceId: subscription.items.data[0]?.price?.id ?? null,
    quantity: subscription.items.data[0]?.quantity ?? null,
    cancel_at_period_end: subscription.cancel_at_period_end,
    cancel_at: subscription.cancel_at,
    customer: subscription.customer as string,
    default_payment_method: subscription.default_payment_method,
    lastPaymentIntentStatus: lastPaymentIntent?.status,
    isTestInstitution: subscription.metadata.isTestInstitution === "true",
    scheduledQuantity: schedule?.phases[0]?.items[0]?.quantity ?? null,
    scheduledPriceId:
      (schedule?.phases[schedule?.phases.length - 1]?.items[0]
        ?.price as string) ?? null,
    interval: price.recurring?.interval ?? null,
    coupon: subscription.discount
      ? {
          percent_off: subscription.discount?.coupon.percent_off,
          amount_off: subscription.discount?.coupon.amount_off,
        }
      : null,
    unit_amount: price.unit_amount,
  };
}

export type AdminDashSubscription = {
  id: string;
  status: Stripe.Subscription.Status;
  current_period_end: number;
  priceId: string | null;
  quantity: number | null;
  unit_amount: number | null;
  cancel_at_period_end: boolean;
  cancel_at?: number | null;
  customer: string;
  interval: Stripe.Price.Recurring.Interval | null;
  isTestInstitution: boolean;
};

export function convertToFuxamAdminDashSubscription(
  subscription: Stripe.Subscription,
): AdminDashSubscription | undefined {
  if (!subscription) return undefined;

  const price = subscription.items.data[0]?.price as Stripe.Price;
  return {
    id: subscription.id,
    status: subscription.status,
    current_period_end: subscription.current_period_end,
    priceId: subscription.items.data[0]?.price?.id ?? null,
    quantity: subscription.items.data[0]?.quantity ?? null,
    cancel_at_period_end: subscription.cancel_at_period_end,
    cancel_at: subscription.cancel_at,
    customer: subscription.customer as string,
    isTestInstitution: subscription.metadata.isTestInstitution === "true",
    interval: price.recurring?.interval ?? null,
    unit_amount: price.unit_amount,
  };
}

export const createBillingPortalSession = async (
  stripeAccount: InstitutionStripeAccount,
  data?: CreateBillingPortalSessionData,
) => {
  const session = await stripe.billingPortal.sessions.create({
    customer: stripeAccount.customerId as string,
    return_url: data?.return_url,
    flow_data: {
      type: "subscription_update",
      subscription_update: {
        subscription: data?.subscriptionId as string,
      },
      after_completion: {
        type: "redirect",
        redirect: {
          return_url: data?.return_url as string,
        },
      },
    },
  });
  return session.url;
};

export const getAccessPassCoupon = async (accessPassDiscount?: number) => {
  let coupon: Stripe.Coupon | undefined;
  if (accessPassDiscount) {
    return await stripe.coupons.create({
      percent_off: accessPassDiscount,
      duration: "once",
      id: "access-pass-discount-" + accessPassDiscount + "-" + cuid(),
    });
  }
  return coupon;
};

export const getMainSubscriptionCoupon = async (
  couponData?: CouponCreateData,
) => {
  let coupon: Stripe.Coupon | undefined;
  if (couponData) {
    const { percent_off, amount_off, duration, duration_in_months } =
      couponData;

    const identifier = percent_off
      ? percent_off + "-percent"
      : amount_off! / 100 + "-euro";

    return await stripe.coupons.create({
      percent_off,
      duration,
      duration_in_months,
      currency: "eur",
      amount_off,
      id: "main-sub-discount-" + identifier + "-" + duration + "-" + cuid(),
    });
  }
  return coupon;
};

export const getStripeSubscriptionCoupon = async (discount?: Discount) => {
  if (discount) {
    return await stripe.coupons.create({
      id: "access-pass-discount" + cuid(),
      amount_off: discount.amount_off,
      percent_off: discount.percent_off,
      duration: "once",
      currency: "eur",
    });
  }
};
