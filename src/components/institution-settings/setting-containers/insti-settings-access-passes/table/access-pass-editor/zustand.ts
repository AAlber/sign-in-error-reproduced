import type Stripe from "stripe";
import { create } from "zustand";
import type { ClientStripeCurrency } from "@/src/utils/stripe-types";

interface AccessPassEditor {
  maxUsers: number | undefined;
  setMaxUsers: (maxUserInput: number | undefined) => void;

  priceForUser?: number;
  setPriceForUser: (price: number | undefined) => void;

  currency?: ClientStripeCurrency;
  setCurrency: (currency: ClientStripeCurrency) => void;

  description: string;
  setDescription: (description: string) => void;

  isPaid: boolean;
  setIsPaid: (paidAccessPass: boolean) => void;

  withMemberLimit: boolean;
  setWithMemberLimit: (selected: boolean) => void;

  taxRate?: Stripe.TaxRate;
  setTaxRate: (taxRate: Stripe.TaxRate | undefined) => void;

  setName: (name: string) => void;
  name: string;
}
const initialState = {
  maxUsers: 10000,
  priceForUser: 0,
  currency: "$" as ClientStripeCurrency,
  description: "",
  isPaid: false,
  withMemberLimit: false,
  taxRate: undefined,
  name: "",
};

export const useAccessPassEditor = create<AccessPassEditor>()((set) => ({
  ...initialState,
  setDescription: (description) => {
    set({ description });
  },
  setCurrency: (currency) => {
    set({ currency });
  },
  setPriceForUser: (price) => {
    set({ priceForUser: price });
  },
  setMaxUsers: (maxUsers) => {
    set({ maxUsers });
  },
  setIsPaid: (isPaid) => {
    set({ isPaid });
  },
  setWithMemberLimit: (withMemberLimit) => {
    set({ withMemberLimit });
  },
  setTaxRate: (taxRate) => {
    set({ taxRate });
  },
  setName: (name) => {
    set({ name });
  },
}));
