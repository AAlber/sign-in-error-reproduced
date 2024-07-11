import type { AppointmentSeries } from "@prisma/client";
import dayjs from "dayjs";
import { RRule } from "rrule";
import { create } from "zustand";
import { getNextRoundedQuarterHour } from "@/src/client-functions/client-appointment";
import type {
  AppointmentInitSource,
  ScheduleAppointment,
} from "@/src/types/appointment.types";
import type { VideoChatProviderId } from "@/src/types/video-chat-provider-integration.types";
import { getDateTimeWithNoChangeInTime } from "./functions";

interface AppointmentEditor {
  open: boolean;
  title: string;
  notes: string;
  userAttendeeIds: string[];
  layerIds: string[]; // these layer ids are attendees of the appointment
  userGroupAttendeeIds: string[];
  dateTime: Date;
  duration: string;
  isOnline: boolean;
  isHybrid: boolean;
  address: string;
  onlineAddress: string;
  recurrence: RRule | null;
  isImportant: boolean;
  appointmentId: string;
  provider: "custom" | "fuxam" | VideoChatProviderId;
  isSettingsMode: boolean;
  roomId: string;
  organizerIds: string[];
  editSeries: boolean;
  series: AppointmentSeries | null;
  setNotes: (data: string) => void;
  setRoomId: (data: string) => void;
  setProvider: (data: "custom" | "fuxam" | VideoChatProviderId) => void;
  setOpen: (data: boolean) => void;
  setUserAttendeeIds: (data: string[]) => void;
  setLayerIds: (data: string[]) => void;
  setUserGroupAttendeeIds: (data: string[]) => void;
  setTitle: (data: string) => void;
  setDate: (data: Date) => void;
  setDateTime: (data: Date) => void;
  setDateTimeNow: () => void;
  setDuration: (data: string) => void;
  setOnline: (data: boolean) => void;
  setHybrid: (data: boolean) => void;
  setAddress: (data: string) => void;
  setOnlineAddress: (data: string) => void;
  setImportant: (data: boolean) => void;
  setOrganizerIds: (data: string[]) => void;
  setRecurrence: (data: RRule | null) => void;
  initSettings: (
    id: string,
    editSeries: boolean,
    data: ScheduleAppointment,
  ) => void;
  init: (data?: { layerIds: string[] }) => void;
  initFromSchedule: (data: { dateTime: Date; duration: string }) => void;
  initSource?: AppointmentInitSource;
  reset: () => void;
}

const initalState = {
  open: false,
  organizerIds: [],
  isSettingsMode: false,
  editSeries: false,
  title: "",
  notes: "",
  userAttendeeIds: [],
  layerIds: [],
  userGroupAttendeeIds: [],
  dateTime: getNextRoundedQuarterHour(dayjs().toDate()),
  duration: "0",
  isHybrid: false,
  isOnline: true,
  provider: "custom" as "custom" | "fuxam" | VideoChatProviderId,
  address: "",
  onlineAddress: "",
  appointmentId: "",
  recurrence: null,
  roomId: "",
  isImportant: false,
  series: null,
  initSource: "default" as AppointmentInitSource,
};

const useAppointmentEditor = create<AppointmentEditor>()((set, get) => ({
  ...initalState,
  setOpen: (data) => set(() => ({ open: data, isSettingsMode: false })),
  setRecurrence: (data) => set(() => ({ recurrence: data })),
  setTitle: (data) => set(() => ({ title: data })),
  setNotes: (data) => set(() => ({ notes: data })),
  setDate: (data) => {
    const dateTime = getDateTimeWithNoChangeInTime(get().dateTime, data);
    return set(() => ({
      dateTime,
    }));
  },
  setDateTime: (data) => set(() => ({ dateTime: data })),
  setDateTimeNow: () =>
    set(() => ({
      dateTime: dayjs().toDate(),
    })),
  setDuration: (data) => set(() => ({ duration: data })),
  setOnline: (data) => set(() => ({ isOnline: data })),
  setHybrid: (data) => set(() => ({ isHybrid: data })),
  setUserAttendeeIds: (data) => set(() => ({ userAttendeeIds: data })),
  setLayerIds: (data) => set(() => ({ layerIds: data })),
  setUserGroupAttendeeIds: (data) =>
    set(() => ({ userGroupAttendeeIds: data })),
  setAddress: (data) => set(() => ({ address: data })),
  setOnlineAddress: (data) => set(() => ({ onlineAddress: data })),
  setImportant: (data) => set(() => ({ isImportant: data })),
  setProvider: (data) => set(() => ({ provider: data })),
  init: (data) =>
    set(() => ({ ...initalState, ...data, open: true, initSource: "default" })),
  setRoomId: (data) => set(() => ({ roomId: data })),
  setOrganizerIds: (data) => set(() => ({ organizerIds: data })),
  initSettings: (id, editSeries, data) =>
    set(() => ({
      ...(data as any),
      appointmentId: id,
      initSource: "settings",
      open: true,
      layerIds: data.appointmentLayers.map((l) => l.layerId),
      organizerIds: data.organizerUsers.map((o) => o.organizerId),
      userAttendeeIds: data.appointmentUsers.map((u) => u.userId),
      userGroupAttendeeIds: data.appointmentUserGroups.map(
        (ug) => ug.userGroupId,
      ),
      editSeries,
      isSettingsMode: true,
      provider: data.provider ? data.provider : "custom",
      recurrence: data.series ? RRule.fromString(data.series.rrule) : null,
    })),
  reset: () => set(() => ({ ...initalState })),
  initFromSchedule: (data) =>
    set(() => ({
      ...initalState,
      ...data,
      initSource: "schedule",
      open: true,
      isSettingsMode: false,
      provider: "custom",
      recurrence: null,
    })),
}));

export default useAppointmentEditor;
