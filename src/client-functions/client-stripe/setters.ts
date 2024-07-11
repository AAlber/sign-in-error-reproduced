import type Stripe from "stripe";
import { useCompanyInfoEditor } from "@/src/components/institution-settings/setting-containers/insti-settings-billing/billing-info-editors/zustand";
import { useUpgradeModal } from "@/src/components/institution-settings/setting-containers/insti-settings-billing/plan-purchased/zustand";
import { usePlanSelector } from "@/src/components/institution-settings/setting-containers/insti-settings-billing/plan-selector/zustand";
import {
  PaymentStage,
  useBilling,
} from "@/src/components/institution-settings/setting-containers/insti-settings-billing/zustand-billing";
import type { FuxamStripeSubscription } from "@/src/utils/stripe-types";
import { getTotalUsers } from "../client-user";
import { moveItemToBeginning } from "../client-utils";
import { getCustomerAndTaxId } from ".";
import { toastUnfilledFields } from "./alerts";
import {
  getDateOfInvoice,
  getUserAmountForUpgrade,
  isTestInstitution,
} from "./data-extrapolation";

export const reorderPaymentMethods = ({
  paymentMethods,
  subscription,
  payMethodId,
}: {
  paymentMethods: Stripe.PaymentMethod[];
  subscription?: Stripe.Subscription;
  payMethodId?: string;
}) => {
  const { setPaymentMethods } = useBilling.getState();
  for (const method of paymentMethods) {
    const subDefaultId = subscription?.default_payment_method;
    const paymentMethodId = payMethodId ? payMethodId : subDefaultId;
    if (subscription && method.id === paymentMethodId) {
      const newArray = moveItemToBeginning(paymentMethods, method.id);
      setPaymentMethods(newArray);
    }
  }
};

export const updateUpgradeUserAmount = (
  subscription: FuxamStripeSubscription,
) => {
  const { setUserAmount } = usePlanSelector.getState();
  const subIsActiveOrUnpaid =
    subscription?.status === "active" ||
    subscription?.status === "unpaid" ||
    subscription?.status === "canceled";
  if (
    subscription &&
    !isTestInstitution() &&
    subIsActiveOrUnpaid &&
    subscription?.quantity
  ) {
    setUserAmount(getUserAmountForUpgrade(subscription));
  }
};

export const reorderPaymentMethodsAndSet = ({
  paymentMethods,
  subscription,
  payMethodId,
}: {
  paymentMethods: Stripe.PaymentMethod[];
  subscription?: Stripe.Subscription;
  payMethodId?: string;
}) => {
  const { setPaymentMethods } = useBilling.getState();
  for (const method of paymentMethods) {
    const subDefaultId = subscription?.default_payment_method;
    const paymentMethodId = payMethodId ? payMethodId : subDefaultId;
    if (subscription && method.id === paymentMethodId) {
      const newArray = moveItemToBeginning(paymentMethods, method.id);
      setPaymentMethods(newArray);
    }
  }
};

export const rearrangeInvoices = (
  invoices: Stripe.Invoice[],
): (Stripe.Invoice | Stripe.UpcomingInvoice)[] => {
  if (!invoices || invoices.length === 0) return [];
  const rearrangedInvoices = [...invoices];
  (rearrangedInvoices as Stripe.Invoice[]).sort(
    (a, b) => getDateOfInvoice(b).getTime() - getDateOfInvoice(a).getTime(),
  );
  const newArray = moveItemToBeginning(rearrangedInvoices, invoices[0]!.id);
  const finalArray = newArray.filter(
    (invoice) => invoice.lines?.data.length > 0 || invoice.total !== 0,
  );
  return finalArray;
};

export const highlightUnfilledCompanyName = (): "unfilled" | "filled" => {
  const { companyName, setCompanyNameFilled } = useCompanyInfoEditor.getState();
  let result: "unfilled" | "filled" = "filled";
  if (companyName === "") {
    setCompanyNameFilled(false);
    result = "unfilled";
  }
  if (result === "unfilled") {
    toastUnfilledFields();
  }
  return result;
};
export const getAndSetCustomer = async () => {
  const { setCustomer } = useBilling.getState();
  const customer = await getCustomerAndTaxId();
  setCustomer(customer.customer);
  return;
};

export const setCurrentAndPreviousTaxId = (result) => {
  const { setTaxId } = useCompanyInfoEditor.getState();
  const { setPreviousTaxId } = useUpgradeModal.getState();
  if (result?.taxIds?.data?.[0]?.value) {
    setTaxId(result.taxIds.data[0].value);
    setPreviousTaxId(result.taxIds.data[0].value);
  }
};
export const updatePaymentStage = (stage) => {
  const { setPaymentStage } = useBilling.getState();
  setPaymentStage(stage);
};

export const setCurrentAndPreviousCompanyName = (result) => {
  const { setCompanyName } = useCompanyInfoEditor.getState();
  const { setPreviousCompanyName } = useUpgradeModal.getState();
  const customer = result.customer as Stripe.Customer;
  if (customer?.metadata?.companyName) {
    setCompanyName(customer.metadata.companyName);
    setPreviousCompanyName(customer.metadata.companyName);
  }
};

export const setCorrectPaymentStage = (
  updatedSubscription?: FuxamStripeSubscription,
) => {
  const { subscription: currentSubscription, setPaymentStage } =
    useBilling.getState();
  const subscription = updatedSubscription
    ? updatedSubscription
    : currentSubscription;
  if (
    !subscription ||
    subscription.status === "incomplete" ||
    subscription.status === "incomplete_expired"
  ) {
    setPaymentStage(PaymentStage.NoPlan);
    return;
  }
  const paymentIntentStatus = subscription.lastPaymentIntentStatus;
  if (subscription) {
    const { status } = subscription;
    if (status === "active" && paymentIntentStatus === "processing") {
      setPaymentStage(PaymentStage.PaymentProcessing);
    } else if (status === "unpaid") {
      setPaymentStage(PaymentStage.Unpaid);
    } else if (status === "canceled") {
      setPaymentStage(PaymentStage.Canceled);
    } else if (status === "active") {
      setPaymentStage(PaymentStage.PlanAlreadyPurchased);
    }
  }
};

export const getAndSetTotalUsers = async () => {
  const { setTotalUsers } = useBilling.getState();
  const totalUsers = await getTotalUsers(false);
  setTotalUsers(totalUsers);
};
