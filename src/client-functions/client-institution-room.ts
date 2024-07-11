import type { InstitutionRoom } from "@prisma/client";
import cuid from "cuid";
import { endOfWeek, format, startOfWeek } from "date-fns";
import { utcToZonedTime } from "date-fns-tz";
import dayjs from "dayjs";
import Papa from "papaparse";
import { useInstitutionRoomList } from "../components/institution-settings/setting-containers/insti-settings-room-management/zustand";
import { toast } from "../components/reusable/toaster/toast";
import api from "../pages/api/api";
import type { InstitutionRoomWithAppointments } from "../types/appointment.types";
import { downloadFileFromUrl } from "./client-utils";

export default function createInstiutionRoom(data: {
  name: string;
  institutionId: string;
  personCapacity: number;
  address: string;
  addressNotes: string;
  amenities: string;
}) {
  const { rooms, setRooms } = useInstitutionRoomList.getState();
  const tempId = cuid();

  setRooms([...rooms, { id: tempId, ...data }]);

  return toast.transaction({
    transaction: async () =>
      fetch(api.createRoom, {
        method: "POST",
        body: JSON.stringify(data),
      }),
    onSuccess: async (res) => {
      const data = await res.json();
      const newRooms = rooms.filter((room) => room.id !== tempId);
      setRooms([...newRooms, data]);
    },
    successMessage: "toast_room_status_success1",
    errorMessage: "toast_room_status_error1",
    processMessage: "toast_room_status_process1",
  });
}

export function updateInstitutionRoom(data: {
  id: string;
  name: string;
  personCapacity: number;
  address: string;
  addressNotes: string;
  amenities: string;
}) {
  const { rooms, setRooms } = useInstitutionRoomList.getState();
  const index = rooms.findIndex((room) => room.id === data.id);
  if (index !== -1) {
    const newRooms = [...rooms];
    newRooms[index] = { ...newRooms[index]!, ...data };
    setRooms(newRooms);
  }
  return toast.transaction({
    transaction: async () =>
      fetch(api.updateRoom, {
        method: "POST",
        body: JSON.stringify(data),
      }),
    successMessage: "toast_room_status_success2",
    errorMessage: "toast_room_status_error2",
    processMessage: "toast_room_status_process2",
  });
}

export function deleteInstitutionRoom(id: string) {
  return toast.transaction({
    transaction: async () =>
      fetch(api.deleteRoom, {
        method: "POST",
        body: JSON.stringify({
          id: id,
        }),
      }),
    successMessage: "Room deleted",
    errorMessage: "Room deletion failed",
    processMessage: "Deleting room...",
  });
}

export async function deleteInstitutionRooms(ids: string[]) {
  const { rooms, setRooms } = useInstitutionRoomList.getState();
  const newRooms = rooms.filter((room) => !ids.includes(room.id));
  setRooms(newRooms);
  return toast.transaction({
    transaction: async () =>
      fetch(api.deleteRooms, {
        method: "POST",
        body: JSON.stringify({ ids }),
      }),
    successMessage: "toast_room_status_success3",
    errorMessage: "toast_room_status_error3",
    processMessage: "toast_room_status_process3",
  });
}

export async function getInstitutionRooms(
  institutionId: string,
  search: string,
): Promise<InstitutionRoom[]> {
  const response = await fetch(
    api.getRoomsOfInstitution + institutionId + "?search=" + search,
  );
  if (!response.ok) {
    toast.responseError({
      title: "toast_room_error1",
      response,
    });
    return [];
  }

  const data = await response.json();
  return data;
}

export async function getInstitutionRoomsWithAppointments(
  institutionId: string,
): Promise<InstitutionRoomWithAppointments[]> {
  const response = await fetch(
    api.getRoomsOfInstitutionWithAppointments + institutionId,
  );
  if (!response.ok) {
    toast.responseError({
      title: "toast_room_error1",
      response,
    });
    return [];
  }
  const data = await response.json();
  return data;
}

export async function getRoomWithAppointments(id: string) {
  const response = await fetch(api.getRoomWithAppointments + id);
  if (!response.ok)
    return toast.responseError({
      title: "toast_room_error2",
      response,
    });
  const data = await response.json();
  return data;
}

export async function getAppointmentsOfRoomForDate(roomId: string, date: Date) {
  const response = await fetch(
    api.getAppointmentsOfRoom +
      "?roomId=" +
      roomId +
      "&date=" +
      date.toISOString(),
  );
  if (!response.ok)
    return toast.responseError({
      title: "toast_room_error3",
      response,
    });
  const data = await response.json();
  return data;
}

/** @deprecated */
export async function downloadWeekRoomPlan(
  id: string,
  span: "this week" | "this month" | "this year",
) {
  const date = new Date();
  let startDate;
  switch (span) {
    case "this week":
      startDate = startOfWeek(date, { weekStartsOn: 1 });
      break;
    case "this month":
      startDate = new Date(date.getFullYear(), date.getMonth(), 1);
      break;
    case "this year":
      startDate = new Date(date.getFullYear(), 0, 1);
      break;
  }

  let endDate;
  switch (span) {
    case "this week":
      endDate = endOfWeek(date, { weekStartsOn: 1 });
      break;
    case "this month":
      endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);
      break;
    case "this year":
      endDate = new Date(date.getFullYear(), 11, 31);
      break;
  }

  const response = await fetch(api.getAppointmentsOfRoom + "?roomId=" + id);

  if (!response.ok)
    return toast.responseError({
      title: "toast_room_error3",
      response,
    });

  const allAppointments = await response.json();

  const appointments = allAppointments.filter((appt: any) => {
    const apptDate = dayjs(appt.dateTime);
    return apptDate.isAfter(startDate) && apptDate.isBefore(endDate);
  });

  console.log(appointments);

  let days;

  switch (span) {
    case "this week":
      days = [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ];
      break;
    case "this month":
      days = Array.from({ length: endDate.getDate() }, (_, i) => i + 1);
      break;
    case "this year":
      days = Array.from({ length: 365 }, (_, i) => i + 1);
      break;
  }

  const times = [
    "0:00",
    "0:30",
    "1:00",
    "1:30",
    "2:00",
    "2:30",
    "3:00",
    "3:30",
    "4:00",
    "4:30",
    "5:00",
    "5:30",
    "6:00",
    "6:30",
    "7:00",
    "7:30",
    "8:00",
    "8:30",
    "9:00",
    "9:30",
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "12:00",
    "12:30",
    "13:00",
    "13:30",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00",
    "16:30",
    "17:00",
    "17:30",
    "18:00",
    "18:30",
    "19:00",
    "19:30",
    "20:00",
    "20:30",
    "21:00",
    "21:30",
    "22:00",
    "22:30",
    "23:00",
    "23:30",
    "24:00",
  ];

  const schedule = {};

  // Initialise schedule
  for (let i = 0; i < days.length; i++) {
    const day = dayjs(startDate).add(i, "day").format("YYYY-MM-DD");
    schedule[day] = {};
    for (const time of times) {
      schedule[day][time] = "";
    }
  }

  // Populate schedule with appointments
  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  for (let i = 0; i < days.length; i++) {
    const day = dayjs(startDate).add(i, "day").format("YYYY-MM-DD");
    for (const appointment of appointments) {
      const apptStart = utcToZonedTime(appointment.dateTime, userTimeZone);
      const apptEnd = new Date(
        apptStart.getTime() + appointment.duration * 60000,
      ); // End time of appointment

      // Iterate over each time slot
      for (let i = 0; i < times.length - 1; i++) {
        // Convert current time slot and next time slot to Date objects for comparison
        const slotStart = new Date(day + "T" + times[i] + ":00");
        const slotEnd = new Date(day + "T" + times[i + 1] + ":00");

        // If appointment overlaps with current time slot and day, add it to the schedule
        if (
          apptStart < slotEnd &&
          apptEnd > slotStart &&
          day === format(apptStart, "yyyy-MM-dd")
        ) {
          if (schedule[day]) {
            schedule[day][times[i]] = appointment.layer.name;
          }
        }
      }
    }
  }

  let csvHeader;
  switch (span) {
    case "this week":
      csvHeader = days.map((_, i) =>
        format(dayjs(startDate).add(i, "day").toDate(), "EEEE"),
      );
      break;
    case "this month":
      csvHeader = days.map((_, i) =>
        format(dayjs(startDate).add(i, "day").toDate(), "d"),
      );
      break;
    case "this year":
      csvHeader = days.map((_, i) =>
        format(dayjs(startDate).add(i, "day").toDate(), "dd. MMM"),
      );
      break;
  }

  const csvData = Papa.unparse({
    fields: ["Time", ...csvHeader],
    data: times.map((time) => [
      time,
      ...days.map((_, i) => {
        const day = dayjs(startDate).add(i, "day").format("YYYY-MM-DD");
        return schedule[day][time];
      }),
    ]),
  });

  const csvBlob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(csvBlob);
  downloadFileFromUrl("room-plan.csv", url);
}
