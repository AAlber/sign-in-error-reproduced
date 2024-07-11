import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { RRule } from "rrule";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/reusable/shadcn-ui/select";
import useAppointmentEditor from "../../zustand";

export default function RecurrenceMonthlySettings() {
  const { recurrence, setRecurrence } = useAppointmentEditor();
  const weekdays = [
    RRule.MO,
    RRule.TU,
    RRule.WE,
    RRule.TH,
    RRule.FR,
    RRule.SA,
    RRule.SU,
  ];
  const weekdaysText = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const [currentWeekday, setCurrentWeekday] = useState(0);
  const weeksOfMonth = ["First", "Second", "Third", "Last"];
  const [currentWeekOfMonth, setCurrentWeekOfMonth] = useState(0);
  const { t } = useTranslation("page");

  const generateByMonthDay = (week) => {
    // For 'Last' week of the month, we use last 7 days
    if (week === 3) return [-7, -6, -5, -4, -3, -2, -1];

    // Otherwise, generate 7 days for specified week
    const startDay = week * 7 + 1;
    return Array.from({ length: 8 }, (_, i) => startDay + i);
  };

  const getByMonthday = () => {
    if (
      recurrence &&
      recurrence.options.freq === RRule.MONTHLY &&
      recurrence.options.byweekday &&
      recurrence.options.bymonthday
    ) {
      const bymonthday = recurrence.options.bymonthday[0]!;
      if (bymonthday < 0) {
        return 3;
      } else {
        return Math.floor((bymonthday - 1) / 7);
      }
    }
    return 0;
  };

  useEffect(() => {
    if (
      recurrence &&
      recurrence.options.freq === RRule.MONTHLY &&
      recurrence.options.byweekday &&
      recurrence.options.bymonthday
    ) {
      const weekday = weekdays.filter((weekday) =>
        recurrence!.options.byweekday!.includes(weekdays.indexOf(weekday)),
      );
      if (weekday) setCurrentWeekday(weekdays.indexOf(weekday[0]!));
      const weekOfMonth = getByMonthday();
      setCurrentWeekOfMonth(weekOfMonth);
    }
  }, [recurrence]);

  if (!recurrence || recurrence.options.freq !== RRule.MONTHLY) return null;

  const handleWeekdayChange = (value) => {
    const index = parseInt(value);
    setCurrentWeekday(index);

    setRecurrence(
      new RRule({
        ...recurrence.options,
        byweekday: weekdays[index],
        bymonthday: generateByMonthDay(currentWeekOfMonth), // specify days of month
      }),
    );
  };

  const handleWeekOfMonthChange = (value) => {
    setCurrentWeekOfMonth(value);

    setRecurrence(
      new RRule({
        ...recurrence.options,
        byweekday: weekdays[currentWeekday],
        bymonthday: generateByMonthDay(value), // specify days of month
      }),
    );
  };

  return (
    <div className="flex items-center gap-2 text-sm text-contrast">
      <>
        <span>{t("appointment_modal.recurrence_monthly_settings_label")}</span>
        <Select
          value={currentWeekOfMonth.toString()}
          onValueChange={handleWeekOfMonthChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="First" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {weeksOfMonth.map((week, index) => (
                <SelectItem key={index} value={index.toString()}>
                  {t(`appointment_modal.recurrence_monthly_settings.${week}`)}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <Select
          value={currentWeekday.toString()}
          onValueChange={handleWeekdayChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="Monday" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {weekdaysText.map((day, index) => (
                <SelectItem key={index} value={index.toString()}>
                  {t(`appointment_modal.recurrence_monthly_settings.${day}`)}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </>
    </div>
  );
}
