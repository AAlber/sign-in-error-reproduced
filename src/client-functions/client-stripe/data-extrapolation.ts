import type { TFunction } from "i18next";
import type Stripe from "stripe";
import { useCompanyInfoEditor } from "@/src/components/institution-settings/setting-containers/insti-settings-billing/billing-info-editors/zustand";
import type { CustomInvoiceLineItem } from "@/src/components/institution-settings/setting-containers/insti-settings-billing/plan-purchased/upgrade-modal/price-summary/line-item";
import { useUpgradeModal } from "@/src/components/institution-settings/setting-containers/insti-settings-billing/plan-purchased/zustand";
import { usePlanSelector } from "@/src/components/institution-settings/setting-containers/insti-settings-billing/plan-selector/zustand";
import {
  PaymentStage,
  useBilling,
} from "@/src/components/institution-settings/setting-containers/insti-settings-billing/zustand-billing";
import useStorageSettings from "@/src/components/institution-settings/setting-containers/insti-settings-storage/zustand";
import { useInstitutionSettings } from "@/src/components/institution-settings/zustand";
import { isPartOfFakeTrialInstitutions } from "@/src/utils/functions";
import type { FuxamStripeSubscription } from "@/src/utils/stripe-types";
import {
  isString,
  replaceVariablesInString,
  roundUpToNearestTen,
} from "../client-utils";
import { isMonthlyPriceId } from "./price-id-manager";
import {
  addTimeToTimestamp,
  formatStripeDate,
  formatStripeMoney,
  getLastStandardPlanDraftInvoice,
  getLastStandardPlanInvoice,
  getPlanInformations,
  isCloserThan10Percent,
} from "./utils";

type BadgeInfoProps = {
  color: "yellow" | "red" | "blue" | "green";
  title: string;
};
export const isTestInstitution = (subscription?: FuxamStripeSubscription) => {
  const { subscription: currentSubscription } = useBilling.getState();
  const sub = subscription ? subscription : currentSubscription;
  return sub?.isTestInstitution;
};

export const invoiceIsFromTestInstitution = (
  invoice?: Stripe.Invoice | Stripe.UpcomingInvoice,
) => {
  const sub = invoice?.subscription as Stripe.Subscription;
  return sub.metadata?.isTestInstitution === "true";
};

export const getSubscriptionInfo = (
  totalUsers: number,
  sub?: FuxamStripeSubscription,
) => {
  const { subscription: zustandSub } = useBilling.getState();
  const subscription = sub || zustandSub;
  const billingCycle = subscription?.interval;
  const selectedQuantity = subscription?.quantity || 0;
  const institutionSize =
    selectedQuantity! < 500 ? "S" : selectedQuantity! < 2000 ? "M" : "L";
  const unitAmount = subscription?.unit_amount;
  const price = unitAmount && "€" + (unitAmount / 100).toFixed(2);
  const dateOfNewInvoice = new Date(subscription!.current_period_end * 1000);
  const isInDangerZone = isCloserThan10Percent(totalUsers, selectedQuantity!);
  const isBeingCancelled = subscription?.cancel_at_period_end || false;
  const isOverLimit = totalUsers > selectedQuantity;
  const hasReachedLimit = totalUsers === selectedQuantity;
  const isCloserThan10PercentToLimit = isCloserThan10Percent(
    totalUsers,
    selectedQuantity!,
  );

  const paymentIntentIsProcessing =
    subscription?.lastPaymentIntentStatus === "processing";
  const paymentInfo: BadgeInfoProps | false = paymentIntentIsProcessing && {
    title: "Payment Processing",
    color: "yellow",
  };
  const unpaidInfo: BadgeInfoProps | false = subscription?.status ===
    "unpaid" && { title: "Payment Unsuccessful", color: "red" };
  const badgeInfo = paymentIntentIsProcessing ? paymentInfo : unpaidInfo;

  return {
    billingCycle,
    institutionSize,
    price,
    dateOfNewInvoice,
    badgeInfo,
    isInDangerZone,
    isTestInstitution,
    isBeingCancelled,
    isOverLimit,
    selectedQuantity,
    isCloserThan10PercentToLimit,
    hasReachedLimit,
  };
};

const getDiscountValues = (discount: Stripe.Coupon) => {
  if (discount.percent_off) {
    return {
      discountMultiplier: 1 - discount.percent_off / 100,
      discountReduction: 0,
      discountString: discount.percent_off + "%",
    };
  } else {
    return {
      discountMultiplier: 1,
      discountReduction: (discount?.amount_off as number) / 100,
      discountString: formatStripeMoney(discount.amount_off),
    };
  }
};

export const canUpgradeInstantly = ({
  subscription,
  newPrice,
  newQuantity,
}: {
  subscription: FuxamStripeSubscription;
  newPrice: string;
  newQuantity: number;
}) => {
  const wasMonthly = isMonthlyPriceId(subscription?.priceId);
  const isNowMonthly = isMonthlyPriceId(newPrice);
  const originalQuantity = subscription?.quantity;
  const newQuantiy = newQuantity;
  const quantityIsNowLess = (originalQuantity as number) > newQuantiy;
  const billingPeriodIsTheSame = wasMonthly === isNowMonthly;
  return billingPeriodIsTheSame && !quantityIsNowLess;
};

export const getPlanChanges = () => {
  const { subscription } = useBilling.getState();
  const lastStandardPlanInvoice = getLastStandardPlanInvoice();
  const lastStandardPlanDraftInvoice = getLastStandardPlanDraftInvoice();
  // const overageExists = subscriptionHasOverage() && generatedInvoice;
  // const generatedTotal =
  //   generatedInvoice && Number(generatedInvoice.total.toFixed(2)) * 100;
  const currentAndFutureInvoiceDontMatch =
    lastStandardPlanDraftInvoice?.total !== lastStandardPlanInvoice?.total;
  const hasPlanChanged =
    currentAndFutureInvoiceDontMatch &&
    !subscription?.cancel_at_period_end &&
    subscription?.scheduledQuantity;
  let futureQuantity: number | null | undefined = 0;
  let updateIsMonthly = false;
  if (hasPlanChanged) {
    futureQuantity = subscription?.scheduledQuantity;
    updateIsMonthly = isMonthlyPriceId(subscription.scheduledPriceId);
  }
  return { hasPlanChanged, futureQuantity, updateIsMonthly };
};

export const getInvoiceInfoFromUserAmount = (
  isMonthly: boolean,
  userAmount?: number,
  coupon?: Stripe.Coupon,
) => {
  const { description, monthlyPerUser, yearlyPerUser } =
    getPlanInformations(userAmount);
  const price = isMonthly ? monthlyPerUser : yearlyPerUser;
  const costPerUser = isMonthly ? monthlyPerUser : yearlyPerUser;
  const timeToday = Math.floor(new Date().getTime() / 1000);
  const currentCycleEnd =
    useBilling.getState().subscription?.current_period_end || timeToday;
  const totalExcludingTax = price * (userAmount as number);
  if (coupon) {
    const { discountMultiplier, discountReduction } = getDiscountValues(coupon);
    const totalExcludingTaxWithDiscount =
      (totalExcludingTax - discountReduction) * discountMultiplier;
    const total =
      (totalExcludingTax - discountReduction) * 1.19 * discountMultiplier;

    return {
      total,
      totalExcludingTax,
      totalExcludingTaxWithDiscount,
      totalFormatted: "€" + total.toFixed(2),
      description,
      costPerUser,
      currentCycleEnd,
    };
  }
  const total = price * (userAmount as number) * 1.19;

  return {
    total,
    totalExcludingTax,
    totalFormatted: "€" + total.toFixed(2),
    description,
    costPerUser,
    currentCycleEnd,
  };
};

export const isInvoiceFromFailedSubAttempt = (
  invoice: Stripe.Invoice | Stripe.UpcomingInvoice,
) => {
  const sub: Stripe.Subscription = invoice.subscription as Stripe.Subscription;
  const incompleteSub =
    sub.status === "incomplete_expired" || sub.status === "incomplete";
  const { status } = invoice;
  return (status === "void" || status === "open") && incompleteSub;
};

export const getInvoiceInfo = (
  invoice: Stripe.Invoice,
  item: Stripe.InvoiceLineItem,
  upgradeIsMonthly: boolean,
) => {
  const { paymentStage, subscription } = useBilling.getState();
  const taxAmounts = item.tax_amounts as Stripe.InvoiceLineItem.TaxAmount[];
  const totalTaxAmount =
    invoice.total_tax_amounts as Stripe.Invoice.TotalTaxAmount[];
  const totalTaxAmountTaxRate = totalTaxAmount[0]?.tax_rate as Stripe.TaxRate;
  const taxRate: Stripe.TaxRate = taxAmounts[0]?.tax_rate as Stripe.TaxRate;
  const percent =
    paymentStage === PaymentStage.PlanAlreadyPurchased
      ? taxRate.percentage
      : totalTaxAmountTaxRate.percentage;
  const inclusive =
    paymentStage === PaymentStage.PlanAlreadyPurchased
      ? taxRate.inclusive
      : totalTaxAmountTaxRate.inclusive;
  const currentCycleEnd = subscription?.current_period_end;
  const newInterval = upgradeIsMonthly ? "month" : "year";
  const currentInterval = subscription && subscription.interval;
  let periodStart: string | number = item.period.start;
  let periodEnd: string | number = item.period.end;
  if (
    subscription &&
    subscription.status === "active" &&
    currentCycleEnd &&
    newInterval !== currentInterval
  ) {
    periodStart = formatStripeDate(currentCycleEnd);
    periodEnd = formatStripeDate(
      addTimeToTimestamp(currentCycleEnd, newInterval),
    );
  }
  return { percent, inclusive, periodStart, periodEnd };
};

export default function getLineItemInfo(props: {
  invoiceLineItem?: CustomInvoiceLineItem;
  invoice?: Stripe.Invoice;
  lineItem?: Stripe.InvoiceLineItem;
  upgradeIsMonthly?: boolean;
}) {
  let data, item;
  if (props.invoice && props.lineItem) {
    data = props.invoice.lines.data;
    item = props.lineItem;
  }
  const { lineItem } = props;
  let percent,
    periodEnd,
    periodStart,
    inclusive,
    description,
    quantity,
    amount,
    unitAmount,
    totalFormatted;
  if (props.invoice) {
    description = lineItem?.description || "";
    quantity = lineItem?.quantity || "";
    unitAmount =
      formatStripeMoney(item.plan?.amount && item.plan?.amount) || "";
    amount = formatStripeMoney(lineItem && lineItem?.amount * 1.19) || "";
    ({ percent, periodEnd, periodStart, inclusive } = getInvoiceInfo(
      props.invoice,
      item,
      props.upgradeIsMonthly || false,
    ));
  } else if (props.invoiceLineItem) {
    ({
      percent,
      periodEnd,
      periodStart,
      inclusive,
      description,
      quantity,
      unitAmount,
      totalFormatted,
    } = props.invoiceLineItem);
    amount = totalFormatted;
  }
  return {
    percent,
    periodEnd,
    periodStart,
    inclusive,
    description,
    quantity,
    amount,
    unitAmount,
  };
}

export const getProrationPriceSummary = (
  invoice: Stripe.Invoice | Stripe.UpcomingInvoice,
) => {
  const {
    lines,
    total,
    subtotal,
    total_excluding_tax,
    tax,
    default_tax_rates,
    discount,
    total_discount_amounts,
  } = invoice;
  const priceList: { name: string; value: string }[] = [];
  for (const line of invoice.lines.data) {
    priceList.push({
      name: line.description as string,
      value: formatStripeMoney(line.amount),
    });
  }

  const restOfSummary = [
    discount ? getSubtotal(subtotal) : null,
    getTotalDiscountAmounts(total_discount_amounts),
    getTotalExcludingTax(total_excluding_tax),
    getTaxDetails(default_tax_rates[0]!, total_excluding_tax, tax),
    getTotal(total),
  ].filter((item) => item !== null) as { name: string; value: string }[];
  priceList.push(...restOfSummary);
  return priceList;
};

export const getSubtotal = (subtotal: number) => ({
  name: "Subtotal",
  value: formatStripeMoney(subtotal),
});

export const getTotalDiscountAmounts = (
  discountAmounts: Stripe.Invoice.TotalDiscountAmount[] | null,
) => {
  if (!discountAmounts || !discountAmounts[0]) return null;
  const { discount } = discountAmounts[0];
  if (isString(discount)) return null;
  const discountValue = discount.coupon.percent_off
    ? discount.coupon.percent_off + "%"
    : formatStripeMoney(discount.coupon.amount_off);

  return {
    name: `Discount (${discount.coupon.name}) - ${discountValue}`,
    value: `- ${formatStripeMoney(discountAmounts[0].amount)}`,
  };
};

export const getTotalExcludingTax = (total_excluding_tax: number | null) => ({
  name: "Total excluding tax",
  value: formatStripeMoney(total_excluding_tax),
});

export const getTaxDetails = (
  taxRate: Stripe.TaxRate,
  total_excluding_tax: number | null,
  tax: number | null,
) => {
  const { percentage, display_name } = taxRate;
  return {
    name: `${display_name} (${percentage}% on ${formatStripeMoney(
      total_excluding_tax,
    )})`,
    value: formatStripeMoney(tax),
  };
};

export function filterDuplicateSepaMethods(
  paymentMethods: Stripe.PaymentMethod[],
) {
  const uniqueSepaKeys = new Set();

  return paymentMethods.filter((method) => {
    if (method.type !== "sepa_debit") {
      // Always include non-SEPA methodsP
      return true;
    }

    // Generate a unique key for each SEPA method
    const sepaKey = `${method.sepa_debit?.last4}-${method.sepa_debit?.bank_code}-${method.sepa_debit?.country}`;

    // Check if this SEPA method is unique
    if (!uniqueSepaKeys.has(sepaKey)) {
      uniqueSepaKeys.add(sepaKey);
      return true;
    }

    // Exclude duplicate SEPA methods
    return false;
  });
}

export const getTotal = (total: number) => ({
  name: "Total",
  value: formatStripeMoney(total),
});

export const getAmountDue = (amount_due: number) => {
  if (amount_due <= 0) return null;

  return {
    name: "Amount due",
    value: formatStripeMoney(amount_due),
  };
};

export const getPriceSummary = (
  invoice: Stripe.Invoice | Stripe.UpcomingInvoice,
): { name: string; value: string }[] => {
  const {
    lines,
    total,
    subtotal,
    total_excluding_tax,
    tax,
    amount_due,
    discount,
  } = invoice;
  const taxRate: Stripe.TaxRate = invoice.total_tax_amounts?.[0]
    ?.tax_rate as Stripe.TaxRate;

  const priceList = [
    getSubtotal(subtotal),
    getDiscount(discount, lines.data[0]?.discount_amounts),
    getTotalExcludingTax(total_excluding_tax),
    getTaxDetails(taxRate, total_excluding_tax, tax),
    getTotal(total),
    getAmountDue(amount_due),
  ].filter((item) => item !== null) as { name: string; value: string }[];

  return priceList;
};

export const getDiscount = (
  discount: Stripe.Discount | null,
  discountAmounts,
) => {
  if (!discount || !discountAmounts || !discountAmounts[0]) return null;

  const discountValue = discount.coupon.percent_off
    ? discount.coupon.percent_off + "%"
    : formatStripeMoney(discount.coupon.amount_off);

  return {
    name: `Discount (${discount.coupon.name}) - ${discountValue}`,
    value: `- ${formatStripeMoney(discountAmounts[0].amount)}`,
  };
};

export const getBillingPeriod = () => {
  const { subscription } = useBilling.getState();
  return subscription?.interval === "month" ? "monthly" : "yearly";
};

export const isSubscriptionMonthly = () => {
  return getBillingPeriod() === "monthly";
};

export const getUserAmountForUpgrade = (
  subscription: FuxamStripeSubscription,
) => {
  const { totalUsers } = useBilling.getState();
  let isOverlimit = false;
  const currentQuantity = subscription?.quantity;
  let upgradeQuantity = currentQuantity
    ? roundUpToNearestTen(currentQuantity)
    : 500;
  if (currentQuantity) {
    isOverlimit = totalUsers > currentQuantity;
    upgradeQuantity = isOverlimit
      ? roundUpToNearestTen(totalUsers)
      : roundUpToNearestTen(currentQuantity);
  }
  return upgradeQuantity;
};

export const hasActiveSubscription = () => {
  const { subscription } = useBilling.getState();
  return subscription?.status === "active";
};

export const getPaymentMethodData = () => {
  const { customer } = useBilling.getState();
  return {
    billing_details: {
      name: customer?.name,
      email: customer?.email,
      address: { ...customer?.address },
      phone: customer?.phone,
    },
  };
};

const getInvoiceDetails = ({
  invoiceSubscription,
  paymentIntent,
  invoice,
}: {
  invoiceSubscription?: Stripe.Subscription | FuxamStripeSubscription;
  paymentIntent: Stripe.PaymentIntent | null;
  invoice?: Stripe.Invoice | Stripe.UpcomingInvoice | null;
}) => {
  const { subscription: currentSubscription } = useBilling.getState();
  const subStatus = invoiceSubscription?.status;
  const incompleteSub =
    subStatus === "incomplete_expired" || subStatus === "incomplete";
  const requiresAction =
    paymentIntent !== null &&
    paymentIntent.status === "requires_payment_method";
  const currentQuantity = currentSubscription?.quantity;
  const { monthlyPerUser, yearlyPerUser } =
    getPlanInformations(currentQuantity);
  const surplusAmount = invoice?.lines.data[0]?.quantity;
  const currentInterval = currentSubscription?.interval;
  const isMonthly = currentInterval === "month";
  const costPerUser = isMonthly ? monthlyPerUser : yearlyPerUser;
  const lastPaymentError = paymentIntent?.last_payment_error?.message;
  const lastPaymentErrorDescription = lastPaymentError
    ? "The last error was: " + lastPaymentError
    : "";
  return {
    incompleteSub,
    requiresAction,
    // isOverageDraft,
    currentQuantity,
    surplusAmount,
    currentInterval,
    isMonthly,
    costPerUser,
    lastPaymentErrorDescription,
  };
};

export const getInvoiceStatusDescription = ({
  t,
  invoice,
}: {
  t: TFunction<"page", undefined>;
  invoice?: Stripe.Invoice | Stripe.UpcomingInvoice;
}) => {
  const { invoiceSubscription, paymentIntent, total } =
    getInvoiceBaseData(invoice);
  const { incompleteSub, requiresAction, lastPaymentErrorDescription } =
    getInvoiceDetails({ invoiceSubscription, paymentIntent, invoice });

  const status = invoice?.status;
  const statusDescription =
    status === "draft"
      ? t("invoices.status_description_2")
      : (status === "void" || "open") && incompleteSub
      ? t("invoices.status_description_3")
      : status === "open" && requiresAction
      ? replaceVariablesInString(t("invoices.status_description_4"), [
          lastPaymentErrorDescription,
        ])
      : status === "open" && paymentIntent
      ? replaceVariablesInString(t("invoices.status_description_5"), [
          lastPaymentErrorDescription,
        ])
      : status === "void"
      ? t("invoices.status_description_6")
      : status === "paid" && total < 0
      ? t("invoices.status_description_7")
      : status === "paid"
      ? t("invoices.status_description_8")
      : t("invoices.status_description_9");
  return statusDescription;
};

export const getDateOfInvoice = (
  invoice: Stripe.Invoice | Stripe.UpcomingInvoice,
) => {
  let dateOfInvoice = new Date(invoice.created * 1000);
  if (invoice.status !== "paid") {
    dateOfInvoice = new Date(invoice.period_end * 1000);
  }
  return dateOfInvoice;
};

export const getInvoiceStatus = ({
  invoice,
}: {
  invoice?: Stripe.Invoice | Stripe.UpcomingInvoice;
}) => {
  const { invoiceSubscription, paymentIntent, total } =
    getInvoiceBaseData(invoice);
  const { requiresAction } = getInvoiceDetails({
    invoiceSubscription,
    paymentIntent,
    invoice,
  });
  const status = invoice?.status;
  const statusTitle =
    status === "draft"
      ? "upcoming"
      : status === "open" && requiresAction
      ? "Failed Payment Attempts"
      : status === "open"
      ? "pending"
      : status === "paid" && total < 0
      ? "Refunded"
      : status;

  return statusTitle;
};

export const getInvoiceHoverData = ({
  t,
  invoice,
}: {
  t: TFunction<"page", undefined>;
  invoice?: Stripe.Invoice | Stripe.UpcomingInvoice;
}) => {
  const status = invoice?.status;
  const statusTitle = getInvoiceStatus({ invoice });
  const statusDescription = getInvoiceStatusDescription({ t, invoice });
  return { statusTitle, statusDescription, status, invoice };
};

export const getInvoiceBaseData = (
  invoice?: Stripe.Invoice | Stripe.UpcomingInvoice,
) => {
  const { subscription: currentSubscription } = useBilling.getState();
  const invoiceSubscription:
    | Stripe.Subscription
    | FuxamStripeSubscription
    | undefined = invoice?.subscription
    ? (invoice?.subscription as Stripe.Subscription)
    : currentSubscription;
  const paymentIntent: Stripe.PaymentIntent | null = invoice?.payment_intent
    ? (invoice?.payment_intent as Stripe.PaymentIntent)
    : null;
  const total = invoice?.total || 0;
  return { total, paymentIntent, invoiceSubscription, status: invoice?.status };
};

export const taxIdHasChanged = () => {
  const { previousTaxId } = useUpgradeModal.getState();
  const { taxId } = useCompanyInfoEditor.getState();
  return taxId !== "" && previousTaxId !== taxId;
};

export const companyNameHasChanged = () => {
  const { previousCompanyName } = useUpgradeModal.getState();
  const { companyName } = useCompanyInfoEditor.getState();
  return previousCompanyName !== companyName;
};

export const getCostOfCurrentSubscriptionPlan = (
  subscription: FuxamStripeSubscription,
) => {
  if (subscription?.scheduledQuantity) {
    const { total } = getLastStandardPlanDraftInvoice()!;
    return total;
  } else {
    const quantity = subscription?.quantity;
    const unitamount = subscription?.unit_amount;
    const cost = quantity && unitamount && quantity * unitamount * 1.19;
    return cost;
  }
};

export const getCheckoutTableData = () => {
  const { subscription } = useBilling.getState();
  const { coupon } = useUpgradeModal.getState();
  const { userAmount, billingPeriod } = usePlanSelector.getState();
  const quantityOfCurrentPlan = subscription?.quantity;
  const quantityOfNewPlan = userAmount;
  const { monthlyPerUser, yearlyPerUser } = getPlanInformations(
    quantityOfCurrentPlan,
  );
  const { monthlyPerUser: monthlyPerUserNew, yearlyPerUser: yearlyPerUserNew } =
    getPlanInformations(quantityOfNewPlan);
  const isMonthlyCurrentPlan = subscription?.interval === "month";
  const isMonthlyNewPlan = billingPeriod === "monthly";
  const costOfCurrentPlan = getCostOfCurrentSubscriptionPlan(subscription!);
  const { total } = getInvoiceInfoFromUserAmount(
    billingPeriod === "monthly",
    userAmount,
    // coupon,
    undefined,
  );
  const costOfNewPlan = total;
  const oldCoupon = subscription?.coupon;
  const oldReduction = oldCoupon?.percent_off
    ? oldCoupon?.percent_off
    : oldCoupon?.amount_off;
  const newReduction = coupon?.percent_off
    ? coupon?.percent_off
    : coupon?.amount_off;
  const oldReductionFormatted = oldCoupon?.percent_off
    ? oldCoupon?.percent_off + "%"
    : "-" + formatStripeMoney(oldCoupon?.amount_off);
  const newReductionFormatted = coupon?.percent_off
    ? coupon?.percent_off + "%"
    : "-" + formatStripeMoney(coupon?.amount_off);
  const reductionsExist = oldReduction || newReduction;
  return {
    quantityOfCurrentPlan,
    quantityOfNewPlan,
    isMonthlyCurrentPlan,
    isMonthlyNewPlan,
    monthlyPerUser,
    monthlyPerUserNew,
    yearlyPerUser,
    yearlyPerUserNew,
    costOfCurrentPlan,
    costOfNewPlan,
    oldReduction,
    newReduction,
    reductionsExist,
    oldReductionFormatted,
    newReductionFormatted,
  };
};

export const getTaxIdAndCompanyName = () => {
  const {
    taxId: taxIdFromModal,
    companyName: companyNameCopy,
    setTaxIdInvalid,
  } = useCompanyInfoEditor.getState();
  let taxId = taxIdFromModal === "" ? undefined : taxIdFromModal;
  taxId = taxIdHasChanged() ? taxId : undefined;
  const companyName = companyNameHasChanged() ? companyNameCopy : undefined;
  return { taxId, companyName, setTaxIdInvalid };
};

export const getInfoFromPaymentStage = () => {
  const { Canceled, NoPlan, PaymentProcessing, PlanAlreadyPurchased, Unpaid } =
    PaymentStage;
  const { paymentStage } = useBilling.getState();
  const hasCancelledOrNoPlan =
    paymentStage === NoPlan || paymentStage === Canceled;
  const paymentIsProcessing = paymentStage === PaymentProcessing;
  const hasPlan =
    paymentStage === PlanAlreadyPurchased ||
    paymentStage === Unpaid ||
    paymentStage === PaymentProcessing;
  return {
    hasCancelledOrNoPlan,
    paymentIsProcessing,
    hasPlan,
  };
};

export function connectAccountHasRequirements(
  connectAccount: Stripe.Account,
): boolean | undefined {
  // Check for the 'requirements' part

  if (!connectAccount) return false;
  const hasRequirements =
    connectAccount.requirements &&
    Object.keys(connectAccount.requirements).some((key) => {
      const value =
        connectAccount.requirements![key as keyof Stripe.Account.Requirements];
      return Array.isArray(value) && value.length > 0;
    });

  // Check for the 'future_requirements' part
  const hasFutureRequirements =
    connectAccount.future_requirements &&
    Object.keys(connectAccount.future_requirements).some((key) => {
      const value =
        connectAccount.future_requirements &&
        connectAccount.future_requirements[
          key as keyof Stripe.Account.FutureRequirements
        ];
      return Array.isArray(value) && value.length > 0;
    });

  return hasRequirements || hasFutureRequirements;
}

export const getTotalFromProrations = () => {
  const lineData = getLastStandardPlanDraftInvoice()?.lines.data;
  if (!lineData) return;
  if ((lineData?.length as number) > 1) {
    let total = 0;
    lineData[0]?.amount;
    for (let i = 0; i < lineData.length - 1; i++) {
      total += lineData[i]?.amount as number;
    }
    return {
      totalExcludingTax: total,
      total: Math.round(total * 1.19),
    };
  }
};

export const getCostOfInstantUpgradeWithScheduledUpgrade = () => {
  const { costOfNewPlan } = getCheckoutTableData();
  const lineData = getLastStandardPlanDraftInvoice()?.lines.data;
  const total = getTotalFromProrations()?.total;
  if (!lineData || !total) return;
  const totalWithScheduled = total + Math.round(costOfNewPlan * 100);
  return formatStripeMoney(totalWithScheduled);
};

export const hasDoneInstantUpgradeThisBillingCycle = () => {
  const lineData = (getLastStandardPlanDraftInvoice() as Stripe.UpcomingInvoice)
    ?.lines.data;
  if (!lineData) return false;
  return lineData.some(
    (line) =>
      line && line.description && line.description?.includes("Remaining"),
  );
};

export const getStorageStatusData = () => {
  const { storage_gb_per_user, storage_base_gb } =
    useInstitutionSettings.getState().institutionSettings;
  const { storageStatus, storageSubscription } = useStorageSettings.getState();

  const { subscription } = useBilling.getState();
  const DEMO_STORAGE_GB = 1;
  const availableStorage =
    (isTestInstitution() && !isPartOfFakeTrialInstitutions()
      ? DEMO_STORAGE_GB
      : storage_base_gb + storage_gb_per_user * (subscription?.quantity || 1)) +
    (storageSubscription?.quantity || 0) * 25;

  const storageStatusData = storageStatus
    ? {
        totalSize: availableStorage,
        categories: [
          {
            size: storageStatus.courseDrivesSize,
            title: "course_drives",
          },
          {
            size: storageStatus.userDrivesSize,
            title: "user_drives",
          },
        ],
      }
    : undefined;
  return storageStatusData;
};
