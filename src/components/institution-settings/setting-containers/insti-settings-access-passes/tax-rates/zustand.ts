import type Stripe from "stripe";
import { create } from "zustand";

interface TaxRates {
  taxRates: Stripe.TaxRate[];
  setTaxRates: (taxRates: Stripe.TaxRate[]) => void;

  selectedTaxType: string;
  setSelectedTaxType: (selectedTaxType: string) => void;

  selectedInclusiveTax: boolean;
  setSelectedInclusiveTax: (selectedInclusiveTax: boolean) => void;

  customDisplayName: string;
  setCustomDisplayName: (customDisplayName: string) => void;

  selectedCountry: string;
  setSelectedCountry: (selectedCountry: string) => void;

  taxRatePercentage: string;
  setTaxRatePercentage: (selectedCountry: string) => void;
}
const initialState = {
  taxRates: [],
  selectedTaxType: "vat",
  selectedInclusiveTax: false,
  customDisplayName: "",
  selectedCountry: "Germany",
  taxRatePercentage: "19",
};

export const useTaxRates = create<TaxRates>()((set) => ({
  ...initialState,
  setTaxRates: (taxRates) => set({ taxRates }),
  setSelectedTaxType: (selectedTaxType) => set({ selectedTaxType }),
  setSelectedInclusiveTax: (selectedInclusiveTax) =>
    set({ selectedInclusiveTax }),
  setCustomDisplayName: (customDisplayName) => set({ customDisplayName }),
  setSelectedCountry: (selectedCountry) => set({ selectedCountry }),
  setTaxRatePercentage: (taxRatePercentage) => set({ taxRatePercentage }),
}));
