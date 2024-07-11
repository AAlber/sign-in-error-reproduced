import { create } from "zustand";
import type { InstitutionStorageStatus } from "@/src/types/storage.types";
import type { FuxamStripeSubscription } from "@/src/utils/stripe-types";

interface StorageSettings {
  storageSubscription: FuxamStripeSubscription | null;
  setStorageSubscription: (data: FuxamStripeSubscription | null) => void;
  setStorageStatus: (data: InstitutionStorageStatus) => void;
  storageStatus: InstitutionStorageStatus | undefined;
  added25gbPackages: number | undefined;
  setAdded25gbPackages: (data: number | undefined) => void;
  loading: boolean;
  setLoading: (data: boolean) => void;
}

const initalState = {
  storageSubscription: null,
  storageStatus: undefined,
  added25gbPackages: 1,
  loading: true,
};

const useStorageSettings = create<StorageSettings>((set) => ({
  ...initalState,
  setStorageSubscription: (data) => set(() => ({ storageSubscription: data })),
  setStorageStatus: (data) => set(() => ({ storageStatus: data })),
  setAdded25gbPackages: (data) => set(() => ({ added25gbPackages: data })),
  setLoading: (data) => set(() => ({ loading: data })),
}));

export default useStorageSettings;
