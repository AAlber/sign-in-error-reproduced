import type Stripe from "stripe";
import { useCompanyInfoEditor } from "@/src/components/institution-settings/setting-containers/insti-settings-billing/billing-info-editors/zustand";
import { useUpgradeModal } from "@/src/components/institution-settings/setting-containers/insti-settings-billing/plan-purchased/zustand";
import { usePlanSelector } from "@/src/components/institution-settings/setting-containers/insti-settings-billing/plan-selector/zustand";
import { useBilling } from "@/src/components/institution-settings/setting-containers/insti-settings-billing/zustand-billing";
import { SettingId } from "@/src/components/institution-settings/tabs";
import { toast } from "@/src/components/reusable/toaster/toast";
import api from "@/src/pages/api/api";
import { stripe } from "@/src/server/singletons/stripe";
import type {
  CreateBillingPortalSessionData,
  CreateCheckoutSessionData,
  CreateSubscriptionData,
  FuxamStripeSubscription,
  UpdateSubscriptionData,
} from "@/src/utils/stripe-types";
import { removeUndefinedAndNullItems } from "../client-utils";
import {
  tellUserAboutAddingBillingInfoFail,
  tellUserPaymentIsProcessing,
  thankUserForPayment,
} from "./alerts";
import {
  companyNameHasChanged,
  getPaymentMethodData,
  getTaxIdAndCompanyName,
  invoiceIsFromTestInstitution,
  isInvoiceFromFailedSubAttempt,
  taxIdHasChanged,
} from "./data-extrapolation";
import type { SupportPackages } from "./price-id-manager";
import { additionalStorage, getPricingModel } from "./price-id-manager";
import {
  respondToStripeErrorOrReturnResult,
  stripeReq,
  toastStripeError,
} from "./request-manager";
import {
  highlightUnfilledCompanyName,
  rearrangeInvoices,
  setCurrentAndPreviousCompanyName,
  setCurrentAndPreviousTaxId,
} from "./setters";
import { throwNoTaxIdError } from "./utils";

export async function getSubscription(alertError = false) {
  const response = await fetch(api.getSubscription, { method: "GET" });
  const result = await response.json();
  return respondToStripeErrorOrReturnResult({
    response,
    result,
    errorTitle: "toast.client-stripe_error1",
    alertError,
  });
}

export async function getPaymentMethods(alertError = false) {
  const response = await fetch(api.getPaymentMethods, { method: "GET" });
  const result = await response.json();
  return respondToStripeErrorOrReturnResult({
    response,
    result,
    errorTitle: "toast.client-stripe_error2",
    alertError,
  });
}

export async function getUserInvoices(
  userId: string,
  alertError = false,
): Promise<(Stripe.Invoice | Stripe.UpcomingInvoice)[]> {
  const response = await fetch(api.getUserInvoices + "?userId=" + userId, {
    method: "GET",
  });
  const result = await response.json();
  const upcomingAndNormalInvoices = respondToStripeErrorOrReturnResult({
    response,
    result,
    errorTitle: "toast.client-stripe_error4",
    alertError,
  });

  let finalArray = removeUndefinedAndNullItems(upcomingAndNormalInvoices);
  finalArray = rearrangeInvoices(finalArray);
  return finalArray;
}

export async function getInvoices(
  alertError = false,
): Promise<(Stripe.Invoice | Stripe.UpcomingInvoice)[]> {
  const response = await fetch(api.getInvoices, { method: "GET" });
  const result = await response.json();
  const upcomingAndNormalInvoices = respondToStripeErrorOrReturnResult({
    response,
    result,
    errorTitle: "toast.client-stripe_error4",
    alertError,
  });

  return formatInvoices(upcomingAndNormalInvoices);
}

export const formatInvoices = (
  invoices: (Stripe.Invoice | Stripe.UpcomingInvoice)[],
) => {
  let finalArray = removeUndefinedAndNullItems(invoices);
  finalArray = rearrangeInvoices(finalArray);
  finalArray = removeFailedSubAttemptInvoices(finalArray);
  finalArray = removeTestInstitutionInvoices(finalArray);
  return finalArray;
};

export const removeFailedSubAttemptInvoices = (
  invoices: (Stripe.Invoice | Stripe.UpcomingInvoice)[],
) => {
  const newArray = invoices.filter((invoice) => {
    return !isInvoiceFromFailedSubAttempt(invoice);
  });
  return newArray;
};
export const removeTestInstitutionInvoices = (
  invoices: (Stripe.Invoice | Stripe.UpcomingInvoice)[],
) => {
  const newArray = invoices.filter((invoice) => {
    return !invoiceIsFromTestInstitution(invoice);
  });
  return newArray;
};

export async function getCustomerAndTaxId(alertError = false) {
  const response = await fetch(api.getCustomerAndTaxId, { method: "GET" });
  const result = await response.json();
  return respondToStripeErrorOrReturnResult({
    response,
    result,
    errorTitle: "toast.client-stripe_error5",
  });
}

export const getSetupSecret = async () => {
  const response = await fetch(api.createSetupIntent, {
    method: "GET",
  });
  const { clientSecret } = await response.json();
  return clientSecret;
};

export const getCoupon = async ({ couponId }: { couponId?: string }) => {
  const response = await fetch(api.getCoupon + `?couponId=${couponId}`, {
    method: "GET",
  });
  const result = await response.json();
  return respondToStripeErrorOrReturnResult({
    response,
    result,
    errorTitle: "Coupon doesn't exist.",
    alertError: false,
  });
};
export const validatePromoCode = async ({
  promoCode,
}: {
  promoCode?: string;
}) => {
  const response = await fetch(api.validatePromoCode, {
    method: "POST",
    body: JSON.stringify({ promoCode }),
  });
  const result = await response.json();
  return respondToStripeErrorOrReturnResult({
    response,
    result,
    errorTitle: "Promo Code is invalid",
    alertError: true,
  });
};

export const updateSubscription = async (
  quantity: number,
  isMonthly: boolean,
  supportPackage?: SupportPackages,
  coupon?: string,
) => {
  const body: UpdateSubscriptionData = {
    quantity: quantity,
    supportPackage: supportPackage !== "none" ? supportPackage : undefined,
    priceId: getPricingModel(quantity, isMonthly)!,
    ...(coupon && coupon !== "" && { promoCode: coupon }),
  };
  return await stripeReq<UpdateSubscriptionData>({
    data: body,
    route: api.updateSubscription,
    method: "POST",
    errorMessage: "toast.client-stripe_error6",
    alertError: true,
  });
};

export const getPaymentIntentState = async () => {
  const response = await fetch(api.getPaymentIntentStatus, {
    method: "GET",
  });

  const res = await response.json();
  return res;
};

export const updateDefaultPaymentMethodIfNecessary = async (
  paymentMethods: Stripe.PaymentMethod[],
  subscription: FuxamStripeSubscription,
) => {
  const { setSubscription } = useBilling.getState();
  if (
    paymentMethods[0] &&
    paymentMethods.length > 0 &&
    subscription &&
    paymentMethods[0].id !== subscription?.default_payment_method
  ) {
    const res = await updateDefaultPaymentMethod(
      paymentMethods[0].id,
      subscription,
    );
    const newSub = await res.json();
    setSubscription(newSub);
    return newSub;
  }
};
export const updateDefaultPaymentMethod = async (
  payMethodId: string,
  subscription: FuxamStripeSubscription,
) => {
  const res = await fetch(api.updateSubscriptionPaymentMethod, {
    method: "POST",
    body: JSON.stringify({
      payMethodId: payMethodId,
      subscriptionId: subscription?.id,
    }),
  });
  return res;
};

export const addPaymentMethodClientSecret = async () => {
  const { setAddPaymentMethodClientSecret } = useBilling.getState();
  setAddPaymentMethodClientSecret(await getSetupSecret());
};

export const confirmAddingPayMethod = async (
  elements: any,
  stripe: any,
  clientSecret: string,
  isFromUpgradeModal: boolean,
) => {
  const { error: submitError } = await elements!.submit();
  if (elements === null) return;
  const previouslyCollectedData = getPaymentMethodData();
  const { error } = await stripe!.confirmSetup({
    clientSecret: clientSecret!,
    elements,
    confirmParams: {
      return_url: `${process.env.NEXT_PUBLIC_SERVER_URL}?page=ORGANIZATION_SETTINGS&tab=${SettingId.Billing}&fromUpgradeModal=${isFromUpgradeModal}`,
      payment_method_data: previouslyCollectedData,
    },
  });
  if (error && error.message) {
    toast.error("toast.client-stripe_error8", {
      description: error.message,
    });
  } else if (submitError) {
    toast.error("toast.client-stripe_error9", {
      description: error.message,
    });
  }
};

export const getAndSetCustomerCompanyNameAndTaxId = async () => {
  const { setCustomer } = useBilling.getState();
  const result = await getCustomerAndTaxId(true);
  if (!result || !result.customer) return;
  setCustomer(result.customer);
  setCurrentAndPreviousTaxId(result);
  setCurrentAndPreviousCompanyName(result);
};

export const checkInstitutionSubscriptionStatus = async () => {
  const res = await fetch(api.checkInstitutionSubscriptionStatus, {
    method: "GET",
  });
  const status = await res.json();
  return status;
};

export const checkAndSetInvalidPromoCode = async (): Promise<
  "unfilled" | "invalid" | Stripe.Coupon
> => {
  const { promoCode, setPromoCodeInvalid } = useCompanyInfoEditor.getState();
  if (promoCode && promoCode !== "") {
    const discount = await validatePromoCode({ promoCode });
    if (!discount || !discount.valid) {
      setPromoCodeInvalid(true);
      return "invalid";
    }

    return discount;
  } else return "unfilled";
};

export const runChecksBeforeFinalUpgradeStep = async () => {
  const { setCoupon } = useUpgradeModal.getState();
  const coupon = await checkAndSetInvalidPromoCode();
  if (coupon === "invalid") return false;
  else if (coupon !== "unfilled") setCoupon(coupon);
  if (highlightUnfilledCompanyName() === "unfilled") return false;
  if (taxIdHasChanged() || companyNameHasChanged()) {
    if ((await addBillingInfoIfPossible()) === "invalid") return false;
  }
  return true;
};

export const runFinalUpgradeStep = async () => {
  const { subscription, paymentMethods, setSubscription, setInvoices } =
    useBilling.getState();
  const { billingPeriod, userAmount, supportPackage } =
    usePlanSelector.getState();
  const { promoCode } = useCompanyInfoEditor.getState();

  const isMonthly = billingPeriod === "monthly";
  subscription &&
    (await updateDefaultPaymentMethodIfNecessary(paymentMethods, subscription));
  const sub = await updateSubscription(
    userAmount as number,
    isMonthly,
    supportPackage,
    promoCode === "" ? undefined : promoCode,
  );
  const invoices = await getInvoices();
  setSubscription(sub);
  setInvoices(invoices);
};

export const updateCustomerInformation = async (elementValues: any) => {
  const response = await fetch(api.updateCustomerInformation, {
    method: "POST",
    body: JSON.stringify({
      address: elementValues && elementValues.value.address,
      phone: elementValues && elementValues.value.phone,
      name: elementValues && elementValues.value.name,
    }),
  });
  const result = await response.json();
  return respondToStripeErrorOrReturnResult({
    response,
    result,
    errorTitle: "toast.client-stripe_error14",
    alertError: true,
  });
};

export const updateCustomerCompanyName = async (companyName: string) => {
  const response = await fetch(api.updateCustomerCompanyName, {
    method: "POST",
    body: JSON.stringify({
      companyName: companyName,
    }),
  });
  const result = await response.json();
  return respondToStripeErrorOrReturnResult({
    response,
    result,
    errorTitle: "toast.client-stripe_error15",
    alertError: true,
  });
};

export const updateCustomerTaxId = async (taxId: string) => {
  const response = await fetch(api.updateCustomerTaxId, {
    method: "POST",
    body: JSON.stringify({
      taxId: taxId,
    }),
  });
  const result = await response.json();
  return respondToStripeErrorOrReturnResult({
    response,
    result,
    errorTitle: "toast.client-stripe_error16",
    alertError: true,
  });
};

export const toggleActiveSubscription = async (isCancelled?: boolean) => {
  const { setSubscription, setInvoices } = useBilling.getState();
  const response = await fetch(
    isCancelled ? api.reactivateSubscription : api.cancelSubscription,
    {
      method: "POST",
    },
  );
  const result = await response.json();

  if (!response.ok) {
    toastStripeError({
      errorMessage: result.message,
      title: isCancelled
        ? "toast.client-stripe_error17"
        : "toast.client-stripe_error18",
    });
    return;
  }
  const invoices = await getInvoices();
  setInvoices(invoices);
  setSubscription(result);
};

export const addBillingInfoIfPossible = async (elementValues?: any) => {
  const { taxId, companyName, setTaxIdInvalid } = getTaxIdAndCompanyName();
  let res = "valid";

  try {
    const promises: Promise<any>[] = [];
    if (elementValues) promises.push(updateCustomerInformation(elementValues));
    if (taxId) promises.push(updateCustomerTaxId(taxId));
    if (companyName) promises.push(updateCustomerCompanyName(companyName));
    const results = await Promise.all(promises);
    if (elementValues && taxId) {
      const [addressResult, taxIdResult, companyNameResult] = results;
      res = throwNoTaxIdError(taxIdResult);
    } else if (taxId) {
      const [taxIdResult] = results;
      res = throwNoTaxIdError(taxIdResult);
    }
  } catch (e) {
    res = "invalid";
    tellUserAboutAddingBillingInfoFail(e);
  }
  return res;
};

export const createSubscription = async (data: CreateSubscriptionData) => {
  return await stripeReq<CreateSubscriptionData>({
    data,
    route: api.createStripeSubscription,
    method: "POST",
    errorMessage: "toast.client-stripe_error7",
  });
};

export const updateCustomerLanguage = async (data: { language: Language }) => {
  return await stripeReq<{ language: Language }>({
    data,
    route: api.updateCustomerLanguage,
    method: "POST",
    alertError: false,
    errorMessage: "toast.client-stripe_error7",
  });
};

export const respondToLastPaymentIntentState = async () => {
  const { setPaymentIntentState } = useBilling.getState();
  const piState = await getPaymentIntentState();
  setPaymentIntentState(piState);
  if (piState === "succeeded") {
    thankUserForPayment();
  } else if (piState === "processing") {
    tellUserPaymentIsProcessing();
  }
};

export async function getUpcomingInvoice(
  subscriptionId: string,
  customerId: string,
) {
  try {
    return await stripe.invoices.retrieveUpcoming({
      subscription: subscriptionId,
      customer: customerId,
      expand: ["subscription"],
    });
  } catch (e) {
    console.error(e);
  }
}

export const getUpcomingInvoicePreview = async (
  data: UpdateSubscriptionData,
) => {
  return await stripeReq({
    data,
    route: api.getUpcomingInvoicePreview,
    method: "POST",
    errorMessage: "Failed to retrieve upcoming invoice preview.",
  });
};

export const purchaseAdditionalStorage = async (quantity: number) => {
  const finalData: CreateCheckoutSessionData = {
    priceId: additionalStorage,
    quantity,
    success_url: `${process.env.NEXT_PUBLIC_SERVER_URL}?page=ORGANIZATION_SETTINGS&tab=${SettingId.DataStoragePrivacy}`,
  };
  return await stripeReq({
    data: finalData,
    route: api.createCheckoutSession,
    method: "POST",
    errorMessage: "Failed to purchase additional storage.",
  });
};

export const createBillingPortalSession = async (
  data: CreateBillingPortalSessionData,
) => {
  return await stripeReq({
    route: api.createBillingPortalSession,
    data,
    method: "POST",
    errorMessage: "Failed to create billing portal session.",
  });
};
