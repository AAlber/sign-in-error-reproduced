import { useTranslation } from "react-i18next";
import { RRule } from "rrule";
import Input from "@/src/components/reusable/input";
import useAppointmentEditor from "../../zustand";

export default function RecurrenceInterval() {
  const { recurrence, setRecurrence } = useAppointmentEditor();
  const { t } = useTranslation("page");

  const handleInputChange = (value) => {
    const interval = parseInt(value);

    if (isNaN(interval) || interval < 1) {
      return;
    }

    setRecurrence(
      new RRule({
        ...recurrence!.options,
        interval: interval,
      }),
    );
  };

  return (
    <div className="flex items-center gap-2 text-sm text-contrast">
      <span>{t("appointment_modal.recurrence_interval_label")}</span>
      <div className="w-20">
        <Input
          maxLength={3}
          showCount={false}
          setText={handleInputChange}
          text={recurrence ? recurrence.options.interval.toString() : ""}
        />
      </div>
    </div>
  );
}
