import { create } from "zustand";
import type { InstitutionUserDataFieldWithValueData } from "@/src/types/institution-user-data-field.types";

export type InstitutionUserDataFieldsList = {
  userDataFields: InstitutionUserDataFieldWithValueData[];
  setUserDataFields: (fields: InstitutionUserDataFieldWithValueData[]) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
};

export const useInstitutionUserDataFieldsList =
  create<InstitutionUserDataFieldsList>((set) => ({
    userDataFields: [],
    setUserDataFields: (fields) => set({ userDataFields: fields }),
    loading: false,
    setLoading: (loading) => set({ loading }),
  }));
