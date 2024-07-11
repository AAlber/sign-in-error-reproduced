import dayjs from "dayjs";
import { RRule } from "rrule";
import {
  createAppointment,
  updateAppointment,
} from "@/src/client-functions/client-appointment";
import { log } from "@/src/utils/logger/logger";
import { isDateOlderThanCurrentDate } from "../../../client-functions/client-rrule-utils";
import usePersistAppointmentEditor from "./persist-appointment-editor-zustand";
import useAppointmentEditor from "./zustand";

//This fn takes 2 datetime (Date type)
//The first param has our time that we don't want to change
//The second param has our desired date but with default time
// The fn will return the Date with desired date but with our original / unchanged time.
export const getDateTimeWithNoChangeInTime = (
  dateWithOriginalTime: Date,
  dateWithDesiredDate: Date,
) => {
  const originalDateTime = dayjs(dateWithOriginalTime);

  const originalHour = originalDateTime.hour();
  const originalMinute = originalDateTime.minute();
  const originalSeconds = originalDateTime.second();

  const dateWithNoChangeInTime = dayjs(dateWithDesiredDate)
    .hour(originalHour)
    .minute(originalMinute)
    .second(originalSeconds)
    .toDate();

  return dateWithNoChangeInTime;
};

export const isTitleNonEmpty = (title: string) => title.trim().length > 0;

export const durationIsNumberAndPositive = (duration: string) => {
  const durationNumber = Number(duration);
  return !isNaN(durationNumber) && durationNumber > 0;
};

export const finishAppointmentCreationOrUpdate = async () => {
  const { isSettingsMode, editSeries } = useAppointmentEditor.getState();

  log.info("Updating appointment...");
  if (isSettingsMode) await updateAppointment(editSeries);
  else {
    log.info("Creating appointment...");
    await createAppointment();
  }
  log.info("Resetting appointment editor...");
};

const isDefaultInit = (initSource: string) => initSource === "default";

export const handleSetDate = (date: Date) => {
  const { setDateTime: setDateTimePersist } =
    usePersistAppointmentEditor.getState();
  const { setDate, initSource } = useAppointmentEditor.getState();
  if (isDefaultInit(initSource!)) {
    log.info("Persisting time because of default init source");
    setDateTimePersist(date);
  }
  log.info("Setting date...");
  setDate(date);
};

export const handleSetTime = (date: Date) => {
  const { setDateTime: setDateTimePersist } =
    usePersistAppointmentEditor.getState();
  const { setDateTime, initSource } = useAppointmentEditor.getState();
  if (isDefaultInit(initSource!)) {
    log.info("Persisting date because of default init source");
    setDateTimePersist(date);
  }
  log.info("Setting time...");
  setDateTime(date);
};

export const handleSetDateTimeNow = () => {
  const { setDateTimeNow: setDateTimeNowPersist } =
    usePersistAppointmentEditor.getState();
  const { setDateTimeNow, initSource } = useAppointmentEditor.getState();

  if (isDefaultInit(initSource!)) {
    log.info("Setting time now and persisting");
    setDateTimeNowPersist();
  }
  log.info("Setting time now...");
  setDateTimeNow();
};

export const handleSetReurrence = () => {
  const { recurrence, setRecurrence, dateTime, initSource } =
    useAppointmentEditor.getState();
  const { dateTime: persistedDateTime } =
    usePersistAppointmentEditor.getState();
  // initialised from settings (updating/editing appointment)
  if (initSource === "settings" && recurrence) {
    log.info("Setting recurrence", recurrence.options);
    setRecurrence(new RRule(recurrence.options));
    return;
  }

  // initialised from "create new appointment" (not from creating a new one from schedule/calendar)
  if (initSource === "default") {
    const maybeUsePersistedDateTime = isDateOlderThanCurrentDate(
      persistedDateTime,
    )
      ? dateTime
      : persistedDateTime;

    log.info("Setting recurrence one month ahead", maybeUsePersistedDateTime);
    setRecurrenceOneMonthAhead(maybeUsePersistedDateTime);
    if (recurrence) setRecurrence(new RRule(recurrence.options));
    return;
  }
  // if initialised from schedule, recurrence should be from current date time
  log.info("Setting recurrence one month ahead", dateTime);
  setRecurrenceOneMonthAhead(dateTime);
};

export const setRecurrenceOneMonthAhead = (dateAndTime: Date) => {
  const { setRecurrence, dateTime } = useAppointmentEditor.getState();
  dateAndTime = new Date(dateAndTime);
  const inOneMonth = new Date(dateAndTime.setMonth(dateAndTime.getMonth() + 1));
  setRecurrence(
    new RRule({
      freq: RRule.WEEKLY,
      interval: 1,
      dtstart: dateTime,
      until: inOneMonth,
    }),
  );
};
