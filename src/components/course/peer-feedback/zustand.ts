// usePeerFeedbackStore.js
import { create } from "zustand";
import type { UserWithPeerFeedback } from "@/src/client-functions/client-peer-feedback";

export interface PeerFeedbackStore {
  isOpen: boolean;
  rating: number;
  data: UserWithPeerFeedback[];
  loading: boolean;
  loadingFeedbackGiven: string[];
  userWithPeerFeedback: UserWithPeerFeedback | undefined;
  feedback: string;
  refresh: number;
  setIsOpen: (isOpen: boolean) => void;
  setRating: (rating: number) => void;
  setLoading: (loading: boolean) => void;
  setLoadingFeedbackGiven: (loadingFeedbackGiven: string[]) => void;
  setUserWithPeerFeedback: (userWithPeerFeedback: UserWithPeerFeedback) => void;
  setFeedback: (feedback: string) => void;
  setData: (data: UserWithPeerFeedback[]) => void;
  refreshFeedback: () => void;
}

const usePeerFeedbackStore = create<PeerFeedbackStore>((set) => ({
  isOpen: false,
  rating: 0,
  loading: false,
  loadingFeedbackGiven: [],
  userWithPeerFeedback: undefined,
  feedback: "",
  refresh: 0,
  data: [],
  setData: (data: UserWithPeerFeedback[]) => set({ data }),
  setIsOpen: (isOpen: boolean) => set({ isOpen }),
  setRating: (rating: number) => set({ rating }),
  setLoading: (loading: boolean) => set({ loading }),
  setLoadingFeedbackGiven: (loadingFeedbackGiven: string[]) =>
    set({ loadingFeedbackGiven }),
  setUserWithPeerFeedback: (userWithPeerFeedback: any) =>
    set({ userWithPeerFeedback }),
  setFeedback: (feedback) => set({ feedback }),
  refreshFeedback: () => set((state) => ({ refresh: state.refresh + 1 })),
}));

export default usePeerFeedbackStore;
