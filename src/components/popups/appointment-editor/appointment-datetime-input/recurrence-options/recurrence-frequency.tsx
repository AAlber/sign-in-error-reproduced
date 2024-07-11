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
import {
  freqToString,
  stringToFreq,
} from "../../../../../client-functions/client-rrule-utils";
import useAppointmentEditor from "../../zustand";

export default function RecurrenceFrequency() {
  const { recurrence, dateTime, setRecurrence } = useAppointmentEditor();
  const { t } = useTranslation("page");

  const calculateUntilDate = (freqValue) => {
    const untilDate = new Date(dateTime.getTime());
    if (freqValue === RRule.DAILY) {
      untilDate.setHours(23, 59, 59, 999);
    } else {
      untilDate.setMonth(untilDate.getMonth() + 1);
    }
    return untilDate;
  };

  return (
    <Select
      value={
        recurrence ? freqToString(recurrence.options.freq) : "doesNotRepeat"
      }
      onValueChange={(value) => {
        if (value === "doesNotRepeat") return setRecurrence(null);
        const freqValue = stringToFreq(value);
        if (freqValue === null) return;

        const untilDate = calculateUntilDate(freqValue);

        setRecurrence(
          new RRule({
            ...recurrence!.options,
            freq: freqValue,
            until: untilDate,
            byweekday:
              freqValue === RRule.WEEKLY ? [dateTime!.getDay()] : undefined,
            bymonthday:
              freqValue === RRule.MONTHLY
                ? [dateTime!.getDate() - 1]
                : undefined,
          }),
        );
      }}
    >
      <SelectTrigger className="h-8 w-40">
        <SelectValue placeholder="Does not repeat" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value="DAILY">
            {recurrence!.options.interval > 1
              ? t("appointment_modal.recurrence_reapeat_day")
              : t("appointment_modal.recurrence_reapeat_days")}
          </SelectItem>
          <SelectItem value="WEEKLY">
            {recurrence!.options.interval > 1
              ? t("appointment_modal.recurrence_reapeat_week")
              : t("appointment_modal.recurrence_reapeat_weeks")}
          </SelectItem>
          <SelectItem value="MONTHLY">
            {recurrence!.options.interval > 1
              ? t("appointment_modal.recurrence_reapeat_month")
              : t("appointment_modal.recurrence_reapeat_months")}
          </SelectItem>
          <SelectItem value="YEARLY">
            {recurrence!.options.interval > 1
              ? t("appointment_modal.recurrence_reapeat_year")
              : t("appointment_modal.recurrence_reapeat_years")}
          </SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
