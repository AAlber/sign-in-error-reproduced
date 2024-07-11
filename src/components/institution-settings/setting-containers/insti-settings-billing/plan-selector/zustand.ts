import { create } from "zustand";
import {
  Standard_Support,
  type SupportPackages,
} from "@/src/client-functions/client-stripe/price-id-manager";

interface PlanSelector {
  userAmount?: number;
  setUserAmount: (data?: number) => void;
  billingPeriod: "monthly" | "yearly";
  setBillingPeriod: (data: "monthly" | "yearly") => void;
  supportPackage: SupportPackages;
  setSupportPackage: (supportPackage: SupportPackages) => void;
}

const initialState = {
  userAmount: 100,
  billingPeriod: "monthly" as "monthly" | "yearly",
  supportPackage: Standard_Support,
};

export const usePlanSelector = create<PlanSelector>()((set) => ({
  ...initialState,
  setUserAmount: (data?: number) => set(() => ({ userAmount: data })),
  setBillingPeriod: (data: "monthly" | "yearly") =>
    set(() => ({ billingPeriod: data })),
  setSupportPackage: (supportPackage) =>
    set({ supportPackage: supportPackage }),
}));
