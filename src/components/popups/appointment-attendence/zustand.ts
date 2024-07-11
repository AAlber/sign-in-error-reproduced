import { create } from "zustand";
import type { MemberWithAttendence } from "@/src/client-functions/client-appointment-attendence";

interface AppointmentAttendenceModal {
  open: boolean;
  setOpen: (data: boolean) => void;
  appointment: any;
  setAppointment: (data: any) => void;
  init: (appointment: any) => void;
  dataToUpdate: MemberWithAttendence[];
  setDataToUpdate: (data: MemberWithAttendence[]) => void;
  refresh: number;
  setRefresh: (data: number) => void;
  countedMembers: number;
  setCountedMembers: (data: number) => void;
}

const initalState = {
  open: false,
  appointment: null,
  dataToUpdate: [],
  refresh: 0,
  countedMembers: 0,
};

const useAppointmentAttendenceModal = create<AppointmentAttendenceModal>(
  (set) => ({
    ...initalState,
    setOpen: (data) => set({ open: data, appointment: null }),
    setAppointment: (data) => set({ appointment: data }),
    init: (appointment) => set({ appointment, open: true }),
    setDataToUpdate: (data) => set({ dataToUpdate: data }),
    setRefresh: (data) => set({ refresh: data }),
    setCountedMembers: (data) => set({ countedMembers: data }),
  }),
);

export default useAppointmentAttendenceModal;
