import { create } from "zustand";

interface BillingUIState {
  companyNameFilled: boolean;
  setCompanyNameFilled: (filled: boolean) => void;

  taxIdInvalid: boolean;
  setTaxIdInvalid: (isValid: boolean) => void;

  promoCodeInvalid: boolean;
  setPromoCodeInvalid: (isValid: boolean) => void;

  taxId: string;
  setTaxId: (taxId: string) => void;

  promoCode: string;
  setPromoCode: (promoCode: string) => void;

  companyName: string;
  setCompanyName: (companyName: string) => void;
}

const initialState = {
  taxIdFilled: true,
  taxIdInvalid: false,
  promoCodeInvalid: false,
  taxId: "",
  promoCode: "",
  companyNameFilled: true,
  companyName: "",
};

export const useCompanyInfoEditor = create<BillingUIState>()((set) => ({
  ...initialState,
  setCompanyName: (companyName) => set({ companyName: companyName }),
  setCompanyNameFilled: (companyNameFilled) =>
    set({ companyNameFilled: companyNameFilled }),
  setTaxIdInvalid: (taxIdInvalid) => set({ taxIdInvalid: taxIdInvalid }),
  setPromoCodeInvalid: (promoCodeInvalid) =>
    set({ promoCodeInvalid: promoCodeInvalid }),
  setTaxId: (taxId) => set({ taxId: taxId }),
  setPromoCode: (promoCode) => set({ promoCode: promoCode }),
}));
