import type { InstitutionRoom } from "@prisma/client";
import type { Message } from "ai";
import produce from "immer";
import { create } from "zustand";
import type { ScheduleAppointment } from "@/src/types/appointment.types";
import type { SimpleCourse } from "@/src/types/course.types";
import type { CarouselApi } from "../../reusable/shadcn-ui/carousel";
import useSchedule from "../../schedule/zustand";

interface AIPlannerState {
  course: SimpleCourse | null;
  messages: Message[];
  rooms: InstitutionRoom[];
  organizers: SimpleUser[];
  waitingForFirstResponse: boolean;
  draftAppointments: ScheduleAppointment[];
  carouselAPI: CarouselApi | null;
  editedByDragAppointment?: ScheduleAppointment;
}

interface AIPlannerActions {
  setCourse: (courses: SimpleCourse) => void;
  setRooms: (rooms: InstitutionRoom[]) => void;
  setOrganizers: (organizers: SimpleUser[]) => void;
  setWaitingForFirstResponse: (waiting: boolean) => void;
  setDraftAppointments: (appointments: ScheduleAppointment[]) => void;
  setCarouselAPI: (api: CarouselApi) => void;
  setMessages: (messages: Message[]) => void;
  updateDraftAppointment: (
    id: string,
    data: Partial<ScheduleAppointment>,
  ) => void;
  reset: () => void;
}

const initialState: AIPlannerState = {
  course: null,
  rooms: [],
  messages: [],
  organizers: [],
  draftAppointments: [],
  waitingForFirstResponse: false,
  carouselAPI: null,
  editedByDragAppointment: undefined,
};

type AIPlannerStore = AIPlannerState & AIPlannerActions;

const usePlanner = create<AIPlannerStore>((set) => ({
  ...initialState,

  setCourse: (course) => set(() => ({ course })),
  setRooms: (rooms) => set(() => ({ rooms })),
  setCarouselAPI: (carouselAPI) => set(() => ({ carouselAPI })),
  setOrganizers: (organizers) => set(() => ({ organizers })),
  setWaitingForFirstResponse: (waitingForFirstResponse) =>
    set(() => ({ waitingForFirstResponse })),
  setMessages: (messages) => set(() => ({ messages })),
  setDraftAppointments: (draftAppointments) =>
    set(() => ({ draftAppointments })),
  updateDraftAppointment: (id, data) =>
    set((state) =>
      produce(state, (draft) => {
        const idx = draft.draftAppointments.findIndex((i) => i.id === id);
        const toUpdate = draft.draftAppointments[idx];
        if (toUpdate) draft.draftAppointments[idx] = { ...toUpdate, ...data };
        useSchedule.getState().updateAppointment(id, data);
      }),
    ),
  reset: () =>
    set((state) => ({
      ...initialState,
      carouselAPI: state.carouselAPI,
    })),
}));

export default usePlanner;
