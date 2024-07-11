import { eachDayOfInterval, endOfWeek, isSameDay, startOfWeek } from "date-fns";
import produce from "immer";
import { mountStoreDevtool } from "simple-zustand-devtools";
import { shallow } from "zustand/shallow";
import { createWithEqualityFn } from "zustand/traditional";
import type { ScheduleAppointment } from "@/src/types/appointment.types";
import useScheduleFilter from "./zustand-filter";

export type AppointmentWithRowData = ScheduleAppointment & {
  startRow: number;
  span: number;
  col: number;
  colSpan: number;
};

export type SCHEDULE_DISPLAY = "day" | "week" | "monitor";

interface Schedule {
  loading: boolean;
  fullScreenView: SCHEDULE_DISPLAY;
  appointmentsOfUserId: string | undefined;
  setFullScreenView: (data: SCHEDULE_DISPLAY) => void;
  canCreate: boolean;
  setCanCreate: (data: boolean) => void;
  setLoading: (data: boolean) => void;
  selectedDay: Date;
  setSelectedDay: (data: Date) => void;
  selectedWeek: Date[];
  setSelectedWeek: (data: Date[]) => void;
  appointments: ScheduleAppointment[];
  allUpcomingAppointments: ScheduleAppointment[];
  setAppointments: (data: ScheduleAppointment[]) => void;
  setAppointmentNotes: (appointmentId: string, notes: string) => void;
  setAllUpcomingAppointments: (data: ScheduleAppointment[]) => void;
  addOrRemoveToUpcomingAppointments: (data: ScheduleAppointment) => void;
  refresh: number;
  refreshAppointments: () => void;
  shouldScrollToExactTime: boolean;
  setShouldScrollToExactTime: (data: boolean) => void;
  setSelectedAppointmentFromSearch: (data?: ScheduleAppointment) => void;
  selectedAppointmentFromSearch?: ScheduleAppointment;
  weekDaysColumSize: number;
  setWeekDaysColumSize: (data: number) => void;
  fullScreen: boolean;
  plannerOpen: boolean;
  setFullScreen: (data: boolean) => void;
  setPlannerOpen: (data: boolean) => void;
  updateAppointment: (id: string, data: Partial<ScheduleAppointment>) => void;
  getAppointment: (id: string) => ScheduleAppointment | undefined;
  resetState: () => void;
}

const currentWeek = new Date();
const start = startOfWeek(currentWeek, { weekStartsOn: 1 });
const end = endOfWeek(currentWeek, { weekStartsOn: 1 });

const week = eachDayOfInterval({ start, end });

const initialState = {
  canCreate: false,
  appointmentsOfUserId: undefined,
  selectedDay: new Date(),
  selectedWeek: week,
  fullScreenView: "week" as SCHEDULE_DISPLAY,
  appointments: [],
  allUpcomingAppointments: [],
  loading: false,
  refresh: 0,
  shouldScrollToExactTime: false,
  selectedAppointmentFromSearch: undefined,
  weekDaysColumSize: 0,
  fullScreen: false,
  plannerOpen: false,
};

const useSchedule = createWithEqualityFn<Schedule>()(
  (set, get) => ({
    ...initialState,
    getAppointment: (id: string) => get().appointments.find((i) => i.id === id),
    setLoading: (data) => set({ loading: data }),
    setCanCreate: (data) => set({ canCreate: data }),
    setPlannerOpen: (data) => set({ plannerOpen: data }),
    setAppointments: (appointments) =>
      set((state) =>
        produce(state, (draftState) => {
          if (state.fullScreenView === "day") {
            draftState.appointments = appointments.filter((a) =>
              isSameDay(a.dateTime, state.selectedDay),
            );
          } else {
            draftState.appointments = appointments;
          }
          const scheduleFilterStore = useScheduleFilter.getState();
          if (scheduleFilterStore.filteredRoom) {
            draftState.appointments = appointments.filter(
              (a) => a.roomId === scheduleFilterStore.filteredRoom!.id,
            );
          }
        }),
      ),
    setAllUpcomingAppointments: (appointments) =>
      set((state) =>
        produce(state, (draftState) => {
          draftState.allUpcomingAppointments = [...appointments]
            .filter(
              (item, index, self) =>
                index === self.findIndex((t) => t.id === item.id),
            )
            .sort(
              (a, b) =>
                new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime(),
            );
        }),
      ),
    setAppointmentNotes: (appointmentId, notes) => {
      const updatedAppointments = get().appointments.map((a) =>
        a.id === appointmentId ? { ...a, notes } : a,
      );

      const updatedUpcomingAppointments = get().allUpcomingAppointments.map(
        (a) => (a.id === appointmentId ? { ...a, notes } : a),
      );
      get().setAppointments(updatedAppointments);
      get().setAllUpcomingAppointments(updatedUpcomingAppointments);
    },
    addOrRemoveToUpcomingAppointments: (appointment) => {
      return set((state) => {
        return produce(state, (draftState) => {
          let draftStateAllUpcomingAppointments = [
            ...draftState.allUpcomingAppointments,
          ].filter((a) => a.id !== appointment.id); // removes the appointment first

          const bufferTime = 60 * 60 * 1000; // 60 minutes
          const now = Date.now() - bufferTime;

          if (new Date(appointment.dateTime).getTime() >= now) {
            // adds the appointment to all upcoming appointments
            // if the appointment is in the future
            draftStateAllUpcomingAppointments = [
              ...draftStateAllUpcomingAppointments,
              {
                ...appointment,
                dateTime: new Date(appointment.dateTime),
              },
            ];
          }

          draftStateAllUpcomingAppointments = [
            ...draftStateAllUpcomingAppointments,
          ]
            .filter(
              (item, index, self) =>
                index === self.findIndex((t) => t.id === item.id),
            ) // removes duplicate if any
            .sort(
              (a, b) =>
                new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime(),
            ); // sorts by dateTime (closest to current day)

          draftState.allUpcomingAppointments =
            draftStateAllUpcomingAppointments;
        });
      });
    },
    setSelectedDay: (data) => set({ selectedDay: data }),
    setSelectedWeek: (data) => set({ selectedWeek: data }),
    setFullScreenView: (data) => set({ fullScreenView: data }),
    refreshAppointments: () => set((state) => ({ refresh: state.refresh + 1 })),
    setShouldScrollToExactTime: (data) =>
      set({ shouldScrollToExactTime: data }),
    setSelectedAppointmentFromSearch: (data) =>
      set({ selectedAppointmentFromSearch: data }),
    setWeekDaysColumSize: (data) => set({ weekDaysColumSize: data }),
    setFullScreen: (data) => set({ fullScreen: data }),
    updateAppointment: (id, data) =>
      set((state) =>
        produce(state, (draft) => {
          const idx = draft.appointments.findIndex((i) => i.id === id);
          const toUpdate = draft.appointments[idx];
          if (toUpdate) {
            draft.appointments[idx] = { ...toUpdate, ...data };
          }
        }),
      ),
    resetState: () =>
      set((state) => ({ ...initialState, loading: state.loading })),
  }),
  shallow,
);

export default useSchedule;

if (process.env.NODE_ENV === "development") {
  mountStoreDevtool("appointments", useSchedule);
}
