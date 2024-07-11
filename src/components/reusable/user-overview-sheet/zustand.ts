import type Stripe from "stripe";
import { create } from "zustand";
import type { InstitutionUserManagementUser } from "@/src/types/user-management.types";
import useECTsExport from "./user-overview-content/user-overview-tables/user-ects-export-table/zustand";

type UserOverviewState = {
  open: boolean;
  setOpen: (open: boolean) => void;
  user: InstitutionUserManagementUser | null;
  setUser: (user: InstitutionUserManagementUser) => void;
  init: (user: InstitutionUserManagementUser) => void;
  customDataLoading: boolean;
  setCustomDataLoading: (loading: boolean) => void;
  customDataValues: {
    userId: string;
    fieldId: string;
    value: string;
  }[];
  setCustomDataValues: (
    values: {
      userId: string;
      fieldId: string;
      value: string;
    }[],
  ) => void;
  invoices: (Stripe.Invoice | Stripe.UpcomingInvoice)[];
  setInvoices: (invoices: (Stripe.Invoice | Stripe.UpcomingInvoice)[]) => void;
};

export const useUserOverview = create<UserOverviewState>((set) => ({
  open: false,
  setOpen: (open) => set({ open }),
  user: null,
  setUser: (user) => set({ user }),
  init: (user) => set({ user, open: true }),
  customDataLoading: false,
  setCustomDataLoading: (customDataLoading) => set({ customDataLoading }),
  customDataValues: [],
  setCustomDataValues: (customDataValues) => set({ customDataValues }),
  invoices: [],
  setInvoices: (invoices) => set({ invoices }),
}));

useUserOverview.subscribe((state, prev) => {
  if (prev.open && !state.open) {
    // reset selectedCourse ids on close - so it doesnt conflict with ectsExport when in UserManagment page
    useECTsExport.setState({ selectedCourseIds: [] });
  }
});
