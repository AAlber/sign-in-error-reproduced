import type Stripe from "stripe";
import { create } from "zustand";
import type { InstitutionUserManagementUser } from "@/src/types/user-management.types";

interface UserOverview {
  open: boolean;
  user: InstitutionUserManagementUser | null;
  invoices: (Stripe.Invoice | Stripe.UpcomingInvoice)[];
  setInvoices: (invoices: (Stripe.Invoice | Stripe.UpcomingInvoice)[]) => void;
  setOpen: (open: boolean) => void;
  init: (user: InstitutionUserManagementUser) => void;
}

const initalState = {
  open: false,
  user: null,
  invoices: [],
};

const useUserOverview = create<UserOverview>((set) => ({
  ...initalState,
  setOpen: (open) => set({ open }),
  init: (user) => set({ user, open: true }),
  setInvoices: (invoices) => set({ invoices }),
}));

export default useUserOverview;
