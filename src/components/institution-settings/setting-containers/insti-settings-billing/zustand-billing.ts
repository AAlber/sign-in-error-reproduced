import type Stripe from "stripe";
import { create } from "zustand";
import type { SupportPackages } from "@/src/client-functions/client-stripe/price-id-manager";
import type { FuxamStripeSubscription } from "@/src/utils/stripe-types";

export enum PaymentStage {
  NoPlan,
  PlanAlreadyPurchased,
  PaymentProcessing,
  Canceled,
  Unpaid,
}

interface Billing {
  billingPeriod: "monthly" | "yearly";
  setBillingPeriod: (data: "monthly" | "yearly") => void;

  invoices: (Stripe.Invoice | Stripe.UpcomingInvoice)[];
  setInvoices: (data: (Stripe.Invoice | Stripe.UpcomingInvoice)[]) => void;

  paymentIntentState: string;
  setPaymentIntentState: (data: string) => void;

  paymentStage: PaymentStage;
  setPaymentStage: (paymentStage: PaymentStage) => void;

  paymentMethods: Stripe.PaymentMethod[];
  setPaymentMethods: (paymentMethods: Stripe.PaymentMethod[]) => void;

  subscription?: FuxamStripeSubscription;
  setSubscription: (subscription: FuxamStripeSubscription) => void;

  addPaymentMethodClientSecret?: string;
  setAddPaymentMethodClientSecret: (clientSecret: string | undefined) => void;

  totalUsers: number;
  setTotalUsers: (totalUsers: number) => void;

  customer?: Stripe.Customer;
  setCustomer: (customer: Stripe.Customer) => void;

  supportPackage: SupportPackages;
  setSupportPackage: (supportPackage: SupportPackages) => void;
}

const initialState = {
  billingPeriod: "monthly" as "monthly" | "yearly",
  latestInvoice: undefined,
  invoices: [],
  paymentIntentState: "",
  paymentMethods: [],
  addPaymentMethodClientSecret: undefined,
  subscription: undefined,
  paymentStage: PaymentStage.NoPlan,
  setupIntentSecret: "",
  totalUsers: 0,
  customer: undefined,
  loadingPlanInfo: false,
  supportPackage: "none" as SupportPackages,
};

export const useBilling = create<Billing>()((set) => ({
  ...initialState,
  setCustomer: (customer: Stripe.Customer) => set({ customer: customer }),
  setTotalUsers: (totalUsers: number) => set({ totalUsers: totalUsers }),
  setPaymentIntentState: (data: string) =>
    set(() => ({ paymentIntentState: data })),
  setInvoices: (data: (Stripe.Invoice | Stripe.UpcomingInvoice)[]) =>
    set(() => ({ invoices: data })),
  setBillingPeriod: (data: "monthly" | "yearly") =>
    set(() => ({ billingPeriod: data })),
  setPaymentMethods: (paymentMethods: Stripe.PaymentMethod[]) =>
    set({ paymentMethods: paymentMethods }),
  setSubscription: (subscription: FuxamStripeSubscription) =>
    set({ subscription: subscription }),
  setPaymentStage: (paymentStage: PaymentStage) =>
    set({ paymentStage: paymentStage }),
  setAddPaymentMethodClientSecret: (clientSecret) =>
    set({ addPaymentMethodClientSecret: clientSecret }),
  setSupportPackage: (supportPackage) =>
    set({ supportPackage: supportPackage }),
}));
