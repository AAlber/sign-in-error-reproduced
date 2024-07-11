import type { User } from "@prisma/client";
import { track } from "@vercel/analytics";
import { utcToZonedTime, zonedTimeToUtc } from "date-fns-tz";
import dayjs from "dayjs";
import type { TFunction } from "i18next";
import { RRule, rrulestr } from "rrule";
import useCourse from "../components/course/zustand";
import useAppointmentEditor from "../components/popups/appointment-editor/zustand";
import { toast } from "../components/reusable/toaster/toast";
import useSchedule from "../components/schedule/zustand";
import api from "../pages/api/api";
import type {
  AppointmentAttendee,
  AppointmentDataTypeWithSeriesData,
  AppointmentEventType,
  ScheduleAppointment,
  UpdateAppointmentData,
  UserInfos,
} from "../types/appointment.types";
import type { UserWithAvailability } from "../types/user-management.types";
import { log } from "../utils/logger/logger";
import useUser from "../zustand/user";
import type { MemberWithAttendence } from "./client-appointment-attendence";
import { getUser } from "./client-user-management";
import { convertTimeToUserTimezone } from "./client-utils";

const validateRrule = (rruleString: string, timezoneOffset: number) => {
  // Extract the start time from DTSTART to determine if a day adjustment is needed
  const dtstartMatch = rruleString.match(
    /DTSTART:(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})/,
  );
  if (!dtstartMatch) return rruleString; // Return original if no DTSTART found

  const hour = parseInt(dtstartMatch[4]!, 10);

  // Calculate the effective hour in local time
  const localHour = hour + timezoneOffset;

  // Determine if day adjustment is needed based on the local hour
  if (localHour >= 0 && localHour < 24) return rruleString; // No adjustment needed if the local hour is on the same day

  // Timezone offset is positive if local time is ahead of UTC (e.g., GMT+2)
  const daysOfWeek = ["MO", "TU", "WE", "TH", "FR", "SA", "SU"]; // Standard order of days for RRULE

  // Adjust days to account for the timezone offset
  const adjustDay = (day) => {
    let index = daysOfWeek.indexOf(day) - (timezoneOffset > 0 ? 1 : -1);
    if (index < 0) index += 7; // Wrap around to the end of the week
    if (index > 6) index -= 7; // Wrap around to the start of the week
    return daysOfWeek[index];
  };

  // Replace days in BYDAY
  return rruleString.replace(/BYDAY=([A-Z,]+)/, (match, days) => {
    const adjustedDays = days.split(",").map(adjustDay).join(",");
    return `BYDAY=${adjustedDays}`;
  });
};

export async function createAppointment(
  updateUi = true,
): Promise<ScheduleAppointment[]> {
  return log.timespan("Create appointment operation", async () => {
    try {
      const state = useAppointmentEditor.getState();
      log.context("Appointment editor state", state);
      const dateTimeUtc = zonedTimeToUtc(
        state.dateTime,
        Intl.DateTimeFormat().resolvedOptions().timeZone,
      );

      track("Appointment created", {
        type: state.isOnline
          ? "Online"
          : state.isHybrid
          ? "Hybrid"
          : "In-Person",
      });

      // Get the timezone offset in minutes from the user's browser
      const timezoneOffsetMinutes = new Date().getTimezoneOffset();

      // Convert it to hours, adjusting the sign to be more intuitive
      const timezoneOffsetHours = -timezoneOffsetMinutes / 60;
      const createData: AppointmentDataTypeWithSeriesData = {
        title: state.title,
        notes: state.notes,
        dateTime: dateTimeUtc.toISOString(),
        duration: parseInt(state.duration),
        isOnline: state.isOnline,
        isHybrid: state.isHybrid,
        address: state.address,
        onlineAddress: state.onlineAddress,
        provider: state.provider,
        roomId: state.roomId,
        layerIds: state.layerIds,
        organizerIds: state.organizerIds,
        userAttendeeIds: state.userAttendeeIds,
        userGroupAttendeeIds: state.userGroupAttendeeIds,
        isSeries: state.recurrence !== null,
        rRule: state.recurrence
          ? validateRrule(state.recurrence.toString(), timezoneOffsetHours)
          : undefined,
      };

      log.info("Creating the appointment, sending request...");
      const response = await fetch(api.createAppointment, {
        method: "POST",
        body: JSON.stringify(createData),
      });

      if (!response.ok) {
        log.response(response);
        throw new Error("Failed to create appointment");
      }

      const data: ScheduleAppointment[] = await response.json();
      if (updateUi) {
        addAppointmentToScheduleUI(data as ScheduleAppointment[]);
      }

      log.info("Updating course appointments zustand");
      useCourse.setState((state) => {
        return {
          appointments: [
            ...data.map((appointment) => {
              return {
                ...appointment,
                dateTime: convertTimeToUserTimezone(appointment.dateTime),
              };
            }),
            ...state.appointments,
          ].sort((a, b) => a.dateTime.getTime() - b.dateTime.getTime()),
        };
      });
      log.info("Appointment created successfully", data);
      return data;
    } catch (error) {
      log.error(error);
      return [];
    }
  });
}

export async function updateAppointment(
  updateSeries: boolean,
): Promise<ScheduleAppointment[]> {
  return log.timespan("Update appointment", async () => {
    try {
      const state = useAppointmentEditor.getState();
      log.context("Appointment editor zustand", state);
      const {
        setAllUpcomingAppointments,
        allUpcomingAppointments,
        setAppointments,
        appointments,
      } = useSchedule.getState();

      // Convert dateTime to UTC
      const dateTimeUtc = zonedTimeToUtc(
        state.dateTime,
        Intl.DateTimeFormat().resolvedOptions().timeZone,
      );

      let rRule: string | undefined = undefined;
      if (state.recurrence) {
        const existingrRule = state.recurrence.toString();

        const rrule = rrulestr(existingrRule);
        const newRRule = new RRule({
          ...rrule.options,
          byhour: dateTimeUtc.getUTCHours(),
          byminute: dateTimeUtc.getUTCMinutes(),
          dtstart: dateTimeUtc,
        });

        rRule = newRRule.toString();
      }

      const updateData: UpdateAppointmentData = {
        id: state.appointmentId,
        title: state.title,
        notes: state.notes,
        dateTime: dateTimeUtc.toISOString(),
        duration: parseInt(state.duration),
        isOnline: state.isOnline,
        isHybrid: state.isHybrid,
        provider: state.provider,
        address: state.address,
        onlineAddress: state.onlineAddress,
        roomId: state.roomId,
        userAttendeeIds: state.userAttendeeIds,
        userGroupAttendeeIds: state.userGroupAttendeeIds,
        layerIds: state.layerIds,
        organizerIds: state.organizerIds,
        updateSeries,
        seriesId: state.series?.id,
        rRule,
      };

      log.info("Sending a request to update appointment...");
      const response = await fetch(api.updateAppointment, {
        method: "POST",
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        log.response(response);
      }
      log.info("Appointment updated successfully.");
      const data: ScheduleAppointment[] = await response.json();

      if (updateSeries) {
        log.info("Updating series appointments in the UI and state.");
        setAllUpcomingAppointments(
          allUpcomingAppointments
            .filter((a) => a.id !== state.appointmentId)
            .filter(
              (appointment) => appointment.series?.id !== state.series?.id,
            ),
        );
        setAppointments(
          appointments
            .filter((a) => a.id !== state.appointmentId)
            .filter(
              (appointment) => appointment.series?.id !== state.series?.id,
            ),
        );
      } else {
        log.info("Updating a single appointment in the UI and state.");
        setAllUpcomingAppointments(
          allUpcomingAppointments.filter((a) => a.id !== state.appointmentId),
        );
        setAppointments(
          appointments.filter((a) => a.id !== state.appointmentId),
        );
      }

      addAppointmentToScheduleUI(data);

      useCourse.setState((course) => {
        return {
          appointments: [
            ...data.map((appointment) => {
              return {
                ...appointment,
                dateTime: convertTimeToUserTimezone(appointment.dateTime),
              };
            }),
            ...course.appointments
              .filter((a) => data.every((d) => d.id !== a.id))
              .filter(
                (a) => !updateSeries || a.series?.id !== state.series?.id,
              ),
          ].sort((a, b) => a.dateTime.getTime() - b.dateTime.getTime()),
        };
      });
      return data;
    } catch (error) {
      log.error(error);
      return [];
    }
  });
}

export async function updateAppointmentURL(appointmentId: string, url: string) {
  try {
    log.info("Updating appointment url...", { appointmentId, url });
    const response = await fetch(api.updateAppointmentURL, {
      method: "POST",
      body: JSON.stringify({
        id: appointmentId,
        url,
      }),
    });

    if (!response.ok) {
      log.response(response);
      throw new Error("Failed updating url");
    }

    const data = await response.json();
    log.info("Appointment URL updated successfully", { appointmentId, url });

    useCourse.setState((state) => ({
      appointments: state.appointments.map((a) =>
        data.id === a.id ? { ...a, address: url } : a,
      ),
    }));

    useSchedule.setState((state) => ({
      appointments: state.appointments.map((a) =>
        data.id === a.id ? { ...a, address: url } : a,
      ),
    }));

    log.info("Schedule appointments state updated with new URL.");

    return data;
  } catch (error) {
    log.error(error);
  }
}

export function getNextRoundedQuarterHour(currentTime: Date): Date {
  log.info("Rounding the time to the next quarter hour", { currentTime });
  const minutes = currentTime.getMinutes();
  const roundedMinutes = Math.ceil(minutes / 15) * 15;
  const roundedTime = new Date(currentTime.getTime());
  roundedTime.setMinutes(roundedMinutes, 0, 0);
  log.info("Rounded time to the next quarter hour", { roundedTime });
  return roundedTime;
}

export function addAppointmentToScheduleUI(
  newAppointments: ScheduleAppointment[],
) {
  log.info("Adding appointments to the schedule UI", newAppointments);
  const { setAppointments, appointments, addOrRemoveToUpcomingAppointments } =
    useSchedule.getState();

  const updatedAppointments = newAppointments.map((appointment) => {
    addOrRemoveToUpcomingAppointments(appointment);
    return {
      ...appointment,
      dateTime: new Date(appointment.dateTime),
    };
  });

  setAppointments([...appointments, ...updatedAppointments]);
  log.info(
    "Appointments added to the schedule UI successfully",
    updatedAppointments,
  );
}

export async function deleteAppointment(
  appointmentId: string,
  deleteSeries: boolean,
  notifyParticipants: boolean,
): Promise<any> {
  log.context("Delete appointment", {
    appointmentId,
    deleteSeries,
    notifyParticipants,
  });
  return log.timespan("Delete appointment", async () => {
    try {
      const {
        setAllUpcomingAppointments,
        allUpcomingAppointments,
        setAppointments,
        appointments,
      } = useSchedule.getState();

      log.info("Starting the deleting appointment...");
      const response = await fetch(api.deleteAppointment, {
        body: JSON.stringify({
          id: appointmentId,
          deleteSeries,
          notifyParticipants,
        }),
        method: "POST",
      });

      if (!response.ok) {
        log.response(response);
        throw new Error("Failed to delete appointment");
      }
      const data = await response.json();
      log.info("Appointment deleted successfully", data);
      useCourse.setState((state) => ({
        appointments: state.appointments
          .filter((appointment) => appointment.id !== data.id)
          .filter(
            (appointment) =>
              !deleteSeries ||
              appointment.series?.id !== data.series?.id ||
              appointment.id === data.seriesId,
          ),
      }));

      log.info("Removing appointment from UI");
      setAllUpcomingAppointments(
        allUpcomingAppointments
          .filter((a) => a.id !== appointmentId)
          .filter(
            (appointment) =>
              !deleteSeries ||
              appointment.series?.id !== data.series?.id ||
              appointment.id === data.seriesId,
          ),
      );

      setAppointments(
        appointments
          .filter((a) => a.id !== appointmentId)
          .filter(
            (appointment) =>
              !deleteSeries ||
              appointment.series?.id !== data.series?.id ||
              appointment.id === data.seriesId,
          ),
      );
      log.info("Appointment deleted successfully", data);
      return data;
    } catch (error) {
      log.error(error);
    }
  });
}

export async function getAppointments(
  forDay: Date,
  filteredLayerIds: string[],
  onlyOrganizedByMe = false,
  appointmentsOfUserId: string,
): Promise<any> {
  log.context("Starting to get appointments", {
    forDay,
    filteredLayerIds,
    onlyOrganizedByMe,
  });

  const forDayUtc = Date.UTC(
    forDay.getFullYear(),
    forDay.getMonth(),
    forDay.getDate(),
  );
  const day = new Date(forDayUtc);

  return log.timespan("Fetching appointments", async () => {
    try {
      const url = new URL(
        api.getAppointments + appointmentsOfUserId,
        window.location.origin,
      );

      url.searchParams.append("forDay", day.toISOString());
      url.searchParams.append("filteredLayerIds", filteredLayerIds.join(","));

      const response = await fetch(url);

      if (!response.ok) {
        log.response(response);
        return toast.responseError({
          response,
          title: "toast_client_appointment.get_appointment",
        });
      }
      const data = await response.json();
      log.info("Appointments fetched successfully", data);
      const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const dataWithLocalTime = data.map((appointment) => {
        return {
          ...appointment,
          dateTime: utcToZonedTime(appointment.dateTime, userTimeZone),
        };
      });
      log.info("Appointments converted to local time zone", dataWithLocalTime);
      if (!onlyOrganizedByMe) {
        return dataWithLocalTime;
      }

      const myUserId = useUser.getState().user.id;

      const appointmentsOnlyOrganizedByMe = dataWithLocalTime.filter(
        (appointment: ScheduleAppointment) =>
          appointment.organizerUsers.some(
            (organizer) => organizer.organizerId === myUserId,
          ),
      );
      return appointmentsOnlyOrganizedByMe;
    } catch (error) {
      log.error(error);
    }
  });
}

export async function getAppointmentsOfWeek(
  forWeek: Date[],
  filteredLayerIds: string[],
  onlyOrganizedByMe = false,
  appointmentsOfUserId?: string,
): Promise<ScheduleAppointment[]> {
  log.context("Getting appointments of the Week", {
    forWeek,
    filteredLayerIds,
    onlyOrganizedByMe,
  });

  const forWeekUtc = forWeek.map((day) => {
    return Date.UTC(day.getFullYear(), day.getMonth(), day.getDate());
  });

  const week = forWeekUtc.map((day) => {
    return new Date(day);
  });

  return log.timespan("Get appointments of the week", async () => {
    try {
      const url = new URL(
        api.getAppointmentsOfWeek + appointmentsOfUserId,
        window.location.origin,
      );

      url.searchParams.append("filteredLayerIds", filteredLayerIds.join(","));
      url.searchParams.append(
        "forWeek",
        week.map((day) => day.toISOString()).join(","),
      );

      const response = await fetch(url);

      if (!response.ok) {
        log.response(response);
        toast.responseError({
          response,
          title: "toast_client_appointment.get_appointment",
        });
      }
      const data = await response.json();
      log.info("Appointments fetched successfully", data);
      // Get user's timezone
      const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

      // Convert each appointment's dateTime from UTC to the user's timezone
      const dataWithLocalTime = data.map((appointment) => {
        return {
          ...appointment,
          dateTime: utcToZonedTime(appointment.dateTime, userTimeZone),
        };
      });

      if (!onlyOrganizedByMe) {
        return dataWithLocalTime;
      }

      const myUserId = useUser.getState().user.id;

      const appointmentsOnlyOrganizedByMe = dataWithLocalTime.filter(
        (appointment: ScheduleAppointment) =>
          appointment.organizerUsers.some(
            (organizer) => organizer.organizerId === myUserId,
          ),
      );
      return appointmentsOnlyOrganizedByMe;
    } catch (error) {
      log.error(error);
    }
  });
}

export async function getLayersAndChildrenWithAppointments(
  ids: string[],
  date?: Date,
) {
  log.context("Get layers and children with appointments", { ids });
  date = date ?? new Date();

  const url = new URL(
    api.getLayersAndChildrenWithAppointments,
    window.location.origin,
  );

  url.searchParams.append("layerIds", ids.join(","));
  url.searchParams.append("date", date.toString());

  const response = await fetch(url);

  if (!response.ok) {
    log.response(response);
    return toast.warning("toast_warning_monitor_no_layers", {
      description: "toast_warning_monitor_no_layers_description",
    });
  }

  const data = await response.json();
  log.info("Layers and children with appointments fetched successfully", data);
  return data;
}

export async function getUsersOfInstitutionAndAvailabilityForTime(
  dateTime: Date,
  duration: string,
): Promise<UserWithAvailability[]> {
  log.context("Get users of institution and availability for time", {
    duration,
    dateTime,
  });
  const dateTimeUtc = zonedTimeToUtc(
    dateTime,
    Intl.DateTimeFormat().resolvedOptions().timeZone,
  );

  const response = await fetch(
    api.getUsersAndAvailability +
      "?dateTime=" +
      dateTimeUtc.toISOString() +
      "&duration=" +
      duration,
    { method: "GET" },
  );
  if (!response.ok) {
    log.response(response);
  }
  const data = await response.json();
  log.info("Users of institution and availability fetched successfully", data);
  return data;
}

export const isAppointmentToday = (appointment: ScheduleAppointment) =>
  new Date(appointment.dateTime).getDay() === new Date().getDay() &&
  new Date(appointment.dateTime).getMonth() === new Date().getMonth() &&
  new Date(appointment.dateTime).getFullYear() === new Date().getFullYear();

export function hasHappened(appointment: ScheduleAppointment) {
  return (
    new Date(appointment.dateTime).getTime() +
      appointment.duration * 60 * 1000 <
    new Date().getTime()
  );
}

export const isAppointmentInFutureDay = (appointment: ScheduleAppointment) => {
  const appointmentDate = new Date(appointment.dateTime);
  const today = new Date();

  const tomorrow = new Date(today);
  tomorrow.setDate(dayjs(tomorrow).add(1, "day").date());

  return appointmentDate.getTime() >= tomorrow.getTime();
};

export async function getChildrenIdsOfLayerInAppointment(
  layerId: string,
): Promise<string[]> {
  log.context("Get children ids of layer in appointment", { layerId });
  try {
    const response = await fetch(
      api.getChildrenIdsOfLayerInAppointment + "?layerId=" + layerId,
      { method: "GET" },
    );
    if (!response.ok) {
      log.response(response);
      toast.responseError({
        response,
      });
      return [];
    }
    const data = await response.json();
    log.info("Children ids of layer in appointment fetched successfully", data);
    return data;
  } catch (error) {
    log.error(error);
    return [];
  }
}

export function isAppointmentOngoing(appointment: ScheduleAppointment) {
  return (
    Date.now() > appointment.dateTime.getTime() &&
    Date.now() <
      appointment.dateTime.getTime() + appointment.duration * 60 * 1000
  );
}

function isValidWithin(
  date: Date | number,
  from: Date | number,
  until: Date | number,
) {
  date = date instanceof Date ? date.getTime() : date;
  from = from instanceof Date ? from.getTime() : from;
  until = until instanceof Date ? until.getTime() : until;
  if (from > until) throw new Error("From cannot be greater than until");
  return date > from && date < until;
}

// Enable checkIn only if appointment is n mins before start and end of appointmentDate
export const checkInValidWithinMins = 15;
export function isReadyForCheckIn(
  appointmentDate: Date | number,
  appointmentDurationMins: number,
  validWithinMins = checkInValidWithinMins,
) {
  log.info("Checking if appointment is ready for check-in", {
    appointmentDate,
    appointmentDurationMins,
    validWithinMins,
  });
  appointmentDate =
    appointmentDate instanceof Date
      ? appointmentDate.getTime()
      : appointmentDate;

  return isValidWithin(
    Date.now(),
    appointmentDate - validWithinMins * 60 * 1000,
    appointmentDate +
      appointmentDurationMins * 60 * 1000 -
      Math.min(appointmentDurationMins, validWithinMins) * 60 * 1000,
  );
}

export const getAppointmentType = ({
  isOnline,
  isHybrid,
}: {
  isOnline: boolean;
  isHybrid: boolean;
}): AppointmentEventType => {
  if (isOnline) return "online";
  if (isHybrid) return "hybrid";
  return "in-person";
};

export const updateAppointmentNotes = async (
  appointmentId: string,
  notes: string,
): Promise<ScheduleAppointment> => {
  log.context("Update appointment notes", { appointmentId, notes });
  try {
    const response = await fetch(api.updateNotes, {
      method: "POST",
      body: JSON.stringify({
        id: appointmentId,
        notes,
      }),
    });
    if (!response.ok) {
      log.response(response);
    }
    const data = await response.json();

    useCourse.setState((state) => ({
      appointments: state.appointments.map((a) =>
        data.id === a.id ? { ...a, notes } : a,
      ),
    }));
    log.info(
      `Successfully updated notes for appointment ID: ${appointmentId}.`,
    );

    return data;
  } catch (error) {
    log.error(error);
    throw new Error("Failed to update appointment notes");
  }
};

export function getUserAppointmentAttendanceDataForExport(
  attendendMember: MemberWithAttendence,
  t: TFunction,
): UserInfos {
  const userAttendanceData: UserInfos = {
    username: attendendMember.name,
    timestamp: attendendMember.firstAttendedAt
      ? dayjs(attendendMember.firstAttendedAt).format("DD. MMM HH:mm")
      : "",
    attendance: attendendMember.attended
      ? t("attendence.attended")
      : t("attendence.not_attended"),
  };

  const userAttendanceDataWithTranslatedObjectKeys = {
    [t("csv.table.headers.name")]: userAttendanceData.username,
    [t("csv.table.headers.timestamp")]: userAttendanceData.timestamp,
    [t("csv.table.headers.attendance")]: userAttendanceData.attendance,
  } as UserInfos;

  log.info("Exporting user appointment attendance data:", {
    userAttendanceData,
  });

  return userAttendanceDataWithTranslatedObjectKeys;
}

export const fetchOrganizers = async () => {
  const { organizerIds } = useAppointmentEditor.getState();
  const organizerDetails = await Promise.all(
    organizerIds.map((id) => getUser(id) as Promise<User>),
  );
  return organizerDetails as unknown as UserWithAvailability[];
};

export const fetchAllAttendees = async (
  dateTime: Date,
  duration: string,
): Promise<AppointmentAttendee[]> => {
  const dateTimeUtc = zonedTimeToUtc(
    dateTime,
    Intl.DateTimeFormat().resolvedOptions().timeZone,
  );

  const res = await fetch(
    api.getPossibleAttendees +
      "?dateTime=" +
      dateTimeUtc.toISOString() +
      "&duration=" +
      duration,
    { method: "GET" },
  );
  if (!res.ok) {
    toast.responseError({
      response: res,
      title: "toast_user_management_error1",
    });
    return [];
  }

  return await res.json();
};

export const fetchSelectedAttendees = async (
  userAttendeeIds: string[],
  layerIds: string[],
  userGroupAttendeeIds: string[],
): Promise<AppointmentAttendee[]> => {
  const res = await fetch(api.getSelectedAttendees, {
    method: "POST",
    body: JSON.stringify({ userAttendeeIds, layerIds, userGroupAttendeeIds }),
  });
  if (!res.ok) {
    toast.responseError({
      response: res,
      title: "toast_user_management_error1",
    });
    return [];
  }

  return await res.json();
};
