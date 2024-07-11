import type Stripe from "stripe";
import { create } from "zustand";

interface UpgradeModal {
  upgradeModalOpen: boolean;
  setUpgradeModalOpen: (open: boolean) => void;

  addPaymentMethodModalOpen: boolean;
  setAddPaymentMethodModalOpen: (open: boolean) => void;

  billingAddressModalOpen: boolean;
  setBillingAddressModalOpen: (open: boolean) => void;

  address: string;
  setAddress: (address: string) => void;
  previousTaxId?: string;
  setPreviousTaxId: (taxId: string) => void;

  previousCompanyName?: string;
  setPreviousCompanyName: (companyName: string) => void;

  coupon: Stripe.Coupon | undefined;
  setCoupon: (discount: Stripe.Coupon | undefined) => void;

  // upgradeLineItem?: CustomInvoiceLineItem;
  // setUpgradeLineItem: (lineItem: CustomInvoiceLineItem) => void;

  billingPeriod: "monthly" | "yearly";
  setBillingPeriod: (data: "monthly" | "yearly") => void;
}

const initialState = {
  addPaymentMethodModalOpen: false,
  upgradeModalOpen: false,
  billingAddressModalOpen: false,
  address: "",
  previousTaxId: undefined,
  coupon: undefined,
  // upgradeLineItem: undefined,
  billingPeriod: "monthly" as "monthly" | "yearly",
  previousCompanyName: "",
};
export const useUpgradeModal = create<UpgradeModal>((set) => ({
  ...initialState,
  setPreviousCompanyName: (companyName) =>
    set({ previousCompanyName: companyName }),
  setBillingPeriod: (data: "monthly" | "yearly") =>
    set({ billingPeriod: data }),
  // setUpgradeLineItem: (lineItem: CustomInvoiceLineItem) => set(() => ({ upgradeLineItem: lineItem })),
  setCoupon: (coupon: Stripe.Coupon | undefined) => set({ coupon: coupon }),
  setPreviousTaxId: (taxId) => set({ previousTaxId: taxId }),
  setAddress: (address) => set({ address }),
  setAddPaymentMethodModalOpen: (open) =>
    set({ addPaymentMethodModalOpen: open, upgradeModalOpen: !open }),
  setUpgradeModalOpen: (open) => set({ upgradeModalOpen: open }),
  setBillingAddressModalOpen: (open) =>
    set({ billingAddressModalOpen: open, upgradeModalOpen: !open }),
}));
