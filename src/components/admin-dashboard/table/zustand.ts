import cuid from "cuid";
import { create } from "zustand";
import type { AdminDashInstitution } from "@/src/utils/stripe-types";

export type AdminDashFilters =
  | "Test Institution"
  | "Fake Trial (like FHS)"
  | "Subscription"
  | "No Subscription"
  | "No Filter";

interface AdminDash {
  adminDashPassword: string;
  setAdminDashPassword: (adminDashPassword: string) => void;

  refresh: number;
  setRefresh: (refresh: number) => void;
  cancelDate?: Date;
  setCancelDate: (cancelDate?: Date) => void;

  filter: AdminDashFilters;
  setFilter: (filter: AdminDashFilters) => void;

  openEditModal: boolean;
  setOpenEditModal: (openEditModal: boolean) => void;

  openedInstitutionId: string | undefined;
  setOpenedInstitutionId: (openedInstitutionId: string | undefined) => void;

  adminDashInstitutions: AdminDashInstitution[];
  setAdminDashInstitutions: (
    adminDashInstitutions: AdminDashInstitution[],
  ) => void;

  passwordConfirmed: boolean;
  setPasswordConfirmed: (passwordConfirmed: boolean) => void;

  openedAdminDashInstitution: AdminDashInstitution | undefined;
  setOpenedAdminDashInstitution: (
    openedAdminDashInstitution: AdminDashInstitution | undefined,
  ) => void;

  setOpenOverviewSheet: (openOverviewSheet: boolean) => void;
  openOverviewSheet: boolean;

  selectedInstitutionIds: string[];
  setSelectedInstitutionIds: (selectedInstitutionIds: string[]) => void;

  key: string;
  setKey: (key: string) => void;
}
const tomorrow = new Date();
export type SubscriptionDuration =
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
  | undefined;

tomorrow.setDate(tomorrow.getDate() + 1);
tomorrow.setHours(0, 0, 0, 0); // set the time to midnight
const initialState = {
  refresh: 0,
  cancelDate: tomorrow,
  adminDashPassword: "",
  filter: "No Filter" as AdminDashFilters,
  openEditModal: false,
  openedInstitutionId: undefined,
  adminDashInstitutions: [] as AdminDashInstitution[],
  passwordConfirmed: false,
  openedAdminDashInstitution: undefined,
  openOverviewSheet: false,
  selectedInstitutionIds: [] as string[],
  key: cuid(),
};

export const useAdminDash = create<AdminDash>()((set) => ({
  ...initialState,
  setAdminDashPassword: (adminDashPassword) => {
    set({ adminDashPassword });
  },
  setRefresh: (refresh) => {
    set({ refresh });
  },
  setCancelDate: (cancelDate) => {
    set({ cancelDate });
  },
  setFilter: (filter) => {
    set({ filter });
  },
  setOpenEditModal: (openEditModal) => {
    set({ openEditModal });
  },
  setOpenedInstitutionId: (openedInstitutionId) => {
    set({ openedInstitutionId });
  },
  setAdminDashInstitutions: (adminDashInstitutions) => {
    set({ adminDashInstitutions });
  },
  setPasswordConfirmed: (passwordConfirmed) => {
    set({ passwordConfirmed });
  },
  setOpenedAdminDashInstitution: (openedAdminDashInstitution) => {
    set({ openedAdminDashInstitution });
  },
  setOpenOverviewSheet: (openOverviewSheet) => {
    set({ openOverviewSheet });
  },
  setSelectedInstitutionIds: (selectedInstitutionIds) => {
    set({ selectedInstitutionIds });
  },
  setKey: (key) => {
    set({ key });
  },
}));
