import type {
  AccessPass,
  AccessPassPaymentInfo,
  Invite,
  PaidAddOn,
  SupportPackage,
} from "@prisma/client";
import type Stripe from "stripe";
import type { SupportPackages } from "../client-functions/client-stripe/price-id-manager";
import type { AdminDashSubscription } from "../server/functions/server-stripe";

type PaidAddOnInfo = {
  priceId: string;
  price: number;
  name: string;
  priceFormatted: string;
  billingInterval: "month" | "year";
  title: string;
  description: string;
  subscription?: Stripe.Subscription;
  setSubscription?: (subscription: Stripe.Subscription) => void;
};

type FrontendCreateCheckoutSessionData = {
  priceId: string;
  quantity?: number;
  success_url: string;
  metadata?: Stripe.MetadataParam;
};

type CreateCheckoutSessionData = FrontendCreateCheckoutSessionData & {
  institutionId?: string;
  accessPassCouponId?: string;
};

type UpdateSubscriptionData = {
  quantity: number;
  priceId: string;
  supportPackage?: SupportPackages;
  promoCode?: string;
};

type UpdateTaxRateData = {
  taxRateId: string;
  active: boolean;
};

type CreateTaxRateData = {
  displayName: string;
  percentage: number;
  inclusive: boolean;
  country: string;
  type: Stripe.TaxRateCreateParams.TaxType | undefined;
};

type CreateSubscriptionData = {
  standardSubscriptionItem: {
    quantity: number;
    priceId: string;
  };
  supportPackagePriceId?: string;
  userId?: string;
  success_url: string;
  cancel_url?: string;
  institutionName: string;
};

type IncludeType = ("paidAddOns" | "accessPasses" | "supportPackage")[];

type MismatchStatus =
  | "stripe-accounts-exist-correctly"
  | "only-normal-stripe-account-exists"
  | "institution-doesnt-exist";

type StripeAccountWithSupportPackage = InstitutionStripeAccount & {
  supportPackage?: SupportPackage;
};

type AdminDashInstitution = {
  institution: Institution & {
    stripeAccount?: Stripe.Account;
  };
  signedInAt: Date | null | string;
  subscription?: AdminDashSubscription;
  totalUsers: number;
  credits: {
    gbPerUser?: number;
    aiCredits?: number;
    baseStorageGb?: number;
    accessPassCouponId?: string;
  };
};

type UpdateCustomerInformationData = {
  address: Stripe.AddressParam;
  phone: string;
  name: string;
};
type EnhancedInvite = PrismaInvite & {
  accessPass?: AccessPass;
};
type EnhancedAccessPass = AccessPass & {
  invite?: PrismaInvite;
};

type CreateAccessPassSubscriptionData = {
  institutionId?: string;
  priceId: string;
  userId?: string;
  accessPassId: string;
};
type CreateAccessPassData = {
  productInfo?: ProductAndPriceInfo;
  isPaid: boolean;
  priceId: string;
  maxUsers?: number;
  userId?: string;
  layerId: string;
};

type UpdateAccessPassData = {
  accessPass: AccessPassWithPaymentInfo;
  isPaid: boolean;
  maxUsers: number | null;
  productAndPriceInfo?: ProductAndPriceInfo;
};

type BasicAccountInfo = { id: string; enabled: boolean; res: Stripe.Account };

type ProductAndPriceInfo = {
  unitAmount: number;
  description: string;
  name: string;
  currency: string;
  taxRateId: string;
};

type CreateUserCheckoutSessionData = {
  userId: string;
  invite: InviteWithPaidAccessPass;
};

type InviteWithAccessPass = Invite & {
  accessPass: AccessPass;
};
type InviteWithPaidAccessPass = Invite & {
  accessPass?: AccessPassWithPaymentInfo | null;
};

type CreatePaidAccessPassData = {
  unitAmount: number;
};

type AccessPassIdData = {
  accessPassId: string;
};

type AccessPassDetails = {
  name: string;
  priceId: string;
  price: string;
  billingPeriodFormatted: string;
};

type ExtendAccessPassData = {
  accessPassId: string;
  additionalPeriods: number;
};
type AdjustAccessPassData = {
  accessPassId: string;
  amountOfPeriodsAfterWhichToCancel: number;
  maxUsers?: number;
};
type AccessPassStatusInfo = {
  status: string | null;
  active: boolean;
  currentMaxUsage: number;
  accessPass: AccessPassWithPaymentInfo;
  link: string | null;
  layerName: string;
};

type ProductAndPriceId = {
  priceId: string;
  productId: string;
};

type StripeCurrency = "usd" | "eur";
type ClientStripeCurrency = "$" | "€";

type AccessPassWithPaymentInfo = AccessPass & {
  accessPassPaymentInfo?: AccessPassPaymentInfo | null;
};

type PaidAddOnStatusInfo = {
  status: string | null;
  active: boolean;
  addOn: PaidAddOn | null;
  subscription: Stripe.Subscription | null;
};

type SubscriptionStatusInfo = {
  status: string | null;
  active: boolean;
  subscription: Stripe.Subscription | null;
};

type CreateUsageLogsData = {
  userId: string;
  invite: EnhancedInvite;
};

type AccessPassCheckResponse = {
  alreadyHadAccessToAccessPassLayer: boolean;
  hasExceededMaxUsers: boolean;
};

type FuxamStripeSubscription =
  | {
      id: string;
      status: Stripe.Subscription.Status;
      current_period_end: number;
      priceId: string | null;
      quantity: number | null;
      unit_amount: number | null;
      cancel_at_period_end: boolean;
      cancel_at?: number | null;
      customer: string;
      default_payment_method: Stripe.Subscription.default_payment_method;
      lastPaymentIntentStatus: Stripe.PaymentIntent.Status;
      isTestInstitution: boolean;
      scheduledQuantity?: number | null;
      scheduledPriceId?: string | null;
      interval: "day" | "week" | "month" | "year" | null;
      coupon: {
        percent_off: Stripe.Coupon.percent_off;
        amount_off: Stripe.Coupon.amount_off;
      } | null;
    }
  | undefined;

export type CreateBillingPortalSessionData = {
  subscriptionId: string;
  return_url: string;
};

export type CouponCreateData = {
  amount_off?: number;
  percent_off?: number;
  duration: Stripe.Coupon.Durations;
  duration_in_months?: number;
};
