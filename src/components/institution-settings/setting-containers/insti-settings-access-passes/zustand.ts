import { create } from "zustand";
import type {
  AccessPassStatusInfo,
  BasicAccountInfo,
} from "@/src/utils/stripe-types";

interface AccessPasses {
  accessPassStatusInfos: AccessPassStatusInfo[];
  setAccessPassStatusInfos: (
    accessPassStatusInfos: AccessPassStatusInfo[],
  ) => void;

  accountInfo?: BasicAccountInfo;
  setAccountInfo: (accountInfo: BasicAccountInfo) => void;

  openAddAccessPassModal: boolean;
  setOpenAddAccessPassModal: (open: boolean) => void;

  accountCompletionInProgress: boolean;
  setAccountCompletionInProgress: (inProgress: boolean) => void;
}
const initialState = {
  accessPassStatusInfos: [] as AccessPassStatusInfo[],
  openAddAccessPassModal: false,
  accountInfo: undefined,
  accountCompletionInProgress: false,
};

export const useAccessPasses = create<AccessPasses>()((set) => ({
  ...initialState,
  setAccessPassStatusInfos: (accessPassStatusInfos) => {
    set({ accessPassStatusInfos });
  },
  setOpenAddAccessPassModal: (openAddAccessPassModal) => {
    set({ openAddAccessPassModal });
  },
  setAccountInfo: (accountInfo) => {
    set({ accountInfo });
  },
  setAccountCompletionInProgress: (accountCompletionInProgress) => {
    set({ accountCompletionInProgress });
  },
}));
