import type Stripe from "stripe";
import { create } from "zustand";
import { One_Day } from "@/src/client-functions/client-stripe/price-id-manager";
import type { LayerUserHasAccessTo } from "@/src/types/user.types";
import type { ClientStripeCurrency } from "@/src/utils/stripe-types";

interface AccessPassCreator {
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

  layer?: LayerUserHasAccessTo;
  setLayer: (layer: LayerUserHasAccessTo) => void;

  priceId: string;
  setPriceId: (priceId: string) => void;
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
  layer: undefined,
  priceId: One_Day,
};

export const useAccessPassCreator = create<AccessPassCreator>()((set) => ({
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
  setLayer: (layer) => {
    set({ layer });
  },
  setPriceId: (priceId) => {
    set({ priceId });
  },
}));
