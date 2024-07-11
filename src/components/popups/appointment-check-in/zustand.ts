import type { AppointmentAttendenceKey } from "@prisma/client";
import { create } from "zustand";

interface AppointmentCheckInModal {
  appointment: any;
  checkInUrl: string;
  isFetchingToken: boolean;
  isListening: boolean;
  key: AppointmentAttendenceKey | null;
  open: boolean;
  token: string;
}

type Methods = {
  init: (appointment: any) => void;
  setCheckInUrl: (data: string) => void;
  setIsFetchingToken: (data: boolean) => void;
  setIsListening: (data: boolean) => void;
  setKey: (data: AppointmentAttendenceKey) => void;
  setOpen: (data: boolean) => void;
  setToken: (data: string) => void;
};

const initialState: AppointmentCheckInModal = {
  open: false,
  appointment: null,
  checkInUrl: "",
  isListening: false,
  key: null,
  isFetchingToken: false,
  token: "",
};

const useAppointmentCheckInModal = create<AppointmentCheckInModal & Methods>()(
  (set) => ({
    ...initialState,
    setToken: (token: string) => set({ token }),
    setIsFetchingToken: (data) => set({ isFetchingToken: data }),
    setIsListening: (data) => set({ isListening: data }),
    setKey: (data) => set({ key: data }),
    setCheckInUrl: (data) => set({ checkInUrl: data }),
    setOpen: (data) => set({ open: data, appointment: null, checkInUrl: "" }),
    init: (appointment) => set({ appointment, open: true }),
  }),
);

useAppointmentCheckInModal.subscribe((state, prev) => {
  if (!state.open && prev.open) {
    useAppointmentCheckInModal.setState(initialState);
  }
});

export default useAppointmentCheckInModal;
