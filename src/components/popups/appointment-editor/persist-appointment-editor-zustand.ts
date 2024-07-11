import dayjs from "dayjs";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getNextRoundedQuarterHour } from "@/src/client-functions/client-appointment";

interface PersistAppointmentEditor {
  dateTime: Date;
  setDateTime: (data: Date) => void;
  setDateTimeNow: () => void;
}

const initialState = {
  dateTime: getNextRoundedQuarterHour(dayjs().toDate()),
};

const usePersistAppointmentEditor = create<PersistAppointmentEditor>()(
  persist(
    (set) => ({
      ...initialState,
      setDateTime: (data) =>
        set(() => ({
          dateTime: data,
        })),
      setDateTimeNow: () =>
        set(() => ({
          dateTime: dayjs().toDate(),
        })),
    }),
    { name: "persist-appointment-editor" },
  ),
);

export default usePersistAppointmentEditor;
