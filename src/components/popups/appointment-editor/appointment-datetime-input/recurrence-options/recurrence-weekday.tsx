import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import type { Weekday } from "rrule";
import { RRule } from "rrule";
import { Button } from "@/src/components/reusable/shadcn-ui/button";
import useAppointmentEditor from "../../zustand";

export default function WeekdaySelector() {
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
  const weekdaysText = ["M", "T", "W", "T", "F", "S", "S"];
  const [selectedDays, setSelectedDays] = useState<Weekday[]>([]);

  const { t } = useTranslation("page");

  useEffect(() => {
    if (
      recurrence!.options.freq === RRule.WEEKLY &&
      recurrence!.options.byweekday
    ) {
      setSelectedDays(
        weekdays.filter((weekday) =>
          recurrence!.options.byweekday!.includes(weekdays.indexOf(weekday)),
        ),
      );
    }
  }, []);

  if (recurrence!.options.freq !== RRule.WEEKLY) return null;

  const handleDayClick = (day: Weekday) => {
    let newSelectedDays: Weekday[];

    if (selectedDays.includes(day)) {
      newSelectedDays = selectedDays.filter((d) => d !== day);
    } else {
      newSelectedDays = [...selectedDays, day];
    }

    setSelectedDays(newSelectedDays);

    setRecurrence(
      new RRule({
        ...recurrence!.options,
        byweekday: newSelectedDays,
      }),
    );
  };

  return (
    <div className="flex items-center gap-2 text-sm text-contrast">
      <span>{t("appointment_modal.recurrence_weekday_label")}</span>
      <div className="flex items-center gap-1">
        {weekdays.map((weekday, index) => (
          <Button
            variant={selectedDays.includes(weekday) ? "cta" : "default"}
            key={index}
            onClick={() => handleDayClick(weekday)}
          >
            {weekdaysText[index]}
          </Button>
        ))}
      </div>
    </div>
  );
}
