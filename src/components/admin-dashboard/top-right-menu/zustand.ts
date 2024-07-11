import { create } from "zustand";

export type AdminDashFilters =
  | "Test Institution"
  | "Fake Trial (like FHS)"
  | "Subscription"
  | "No Subscription"
  | "No Filter";

interface AdminDash {
  language: "en" | "de";
  setLanguage: (language: "en" | "de") => void;

  duration: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | undefined;
  setDuration: (
    duration: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | undefined,
  ) => void;

  logoLink: string | undefined;
  setLogoLink: (logoLink: string | undefined) => void;

  baseStorageGb: number | undefined;
  setBaseStorageGb: (baseStorageGb: number | undefined) => void;

  gbPerUser: number | undefined;
  setGbPerUser: (gbPerUser: number | undefined) => void;

  accessPassDiscount: number | undefined;
  setAccessPassDiscount: (accessPassDiscount: number | undefined) => void;

  open: boolean;
  setOpen: (open: boolean) => void;

  name?: string;
  setName: (name?: string) => void;

  email?: string;
  setEmail: (email?: string) => void;

  aiCredits: number | undefined;
  setAiCredits: (aiCredits: number | undefined) => void;

  loading: boolean;
  setLoading: (loading: boolean) => void;

  setDiscountEnabled: (discountEnabled: boolean) => void;
  discountEnabled: boolean;
}
export type InstitutionCreatorType = {
  creatorType: "payment-link" | "create-organization";
};

export type Discount = {
  amount_off?: number;
  percent_off?: number;
  type: "once" | "repeating";
  duration: number;
};

const initialState = {
  language: "en" as "en" | "de",
  duration: undefined as
    | 1
    | 2
    | 3
    | 4
    | 5
    | 6
    | 7
    | 8
    | 9
    | 10
    | 11
    | 12
    | undefined,
  name: undefined,
  email: undefined,
  aiCredits: 100000,
  open: false,
  baseStorageGb: 25,
  gbPerUser: 3,
  accessPassDiscount: 0,
  logoLink: undefined,
  loading: false,
  discountEnabled: false,
};

const setters = (set) => ({
  ...initialState,
  setLanguage: (language) => {
    set({ language });
  },
  setDuration: (duration) => {
    set({ duration });
  },
  setName: (name) => {
    set({ name });
  },
  setEmail: (email) => {
    set({ email });
  },
  setAiCredits: (aiCredits) => {
    set({ aiCredits });
  },
  setOpen: (open) => {
    set({ open });
  },
  setBaseStorageGb: (baseStorageGb) => {
    set({ baseStorageGb });
  },
  setGbPerUser: (gbPerUser) => {
    set({ gbPerUser });
  },
  setAccessPassDiscount: (accessPassDiscount) => {
    set({ accessPassDiscount });
  },
  setLogoLink: (logoLink) => {
    set({ logoLink });
  },
  setLoading: (loading) => {
    set({ loading });
  },
  setMainSubscriptionDiscount: (mainSubscriptionDiscount) => {
    set({ mainSubscriptionDiscount });
  },
  setDiscountEnabled: (discountEnabled) => {
    set({ discountEnabled });
  },
});

export const useCreateInstitutionPopover = create<AdminDash>(setters);
export const useCreatePaymentLink = create<AdminDash>(setters);
