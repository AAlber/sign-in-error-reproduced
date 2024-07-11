import dayjs from "dayjs";
import React from "react";
import { useTranslation } from "react-i18next";
import { RRule } from "rrule";
import DateTimePicker from "@/src/components/reusable/date-time-picker";
import useAppointmentEditor from "../../zustand";

export default function RecurrenceUntil() {
  const { recurrence, dateTime, setRecurrence } = useAppointmentEditor();
  const { t } = useTranslation("page");

  const in1Hour = new Date();
  in1Hour.setHours(in1Hour.getHours() + 1);
  const minDate = new Date(in1Hour);

  const in1Year = new Date();
  in1Year.setFullYear(in1Year.getFullYear() + 1);
  const inOneYear = new Date(in1Year);

  const handleInputChange = (value) => {
    const untilDate = new Date(value);
    setRecurrence(
      new RRule({
        ...recurrence!.options,
        until: dayjs(untilDate).endOf("day").toDate(),
      }),
    );
  };
  const [dateToShow, setDateToShow] = React.useState<Date | undefined>(
    inOneYear,
  );
  return (
    <div className="flex items-center gap-2 text-sm text-contrast">
      <span>{t("appointment_modal.recurrence_until_label")}</span>
      <DateTimePicker
        onCalendarOpen={() => setDateToShow(minDate)}
        placeholder="Choose date and time"
        value={
          recurrence && recurrence.options.until
            ? recurrence.options.until
            : inOneYear
        }
        onChange={handleInputChange}
      />
    </div>
  );
}
