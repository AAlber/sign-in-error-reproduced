import Divider from "@/src/components/reusable/divider";
import useAppointmentEditor from "../../zustand";
import RecurrenceFrequency from "./recurrence-frequency";
import RecurrenceInterval from "./recurrence-interval";
import RecurrenceMonthlySettings from "./recurrence-monthly-settings";
import RecurrenceUntil from "./recurrence-until";
import WeekdaySelector from "./recurrence-weekday";

export default function RecurrenceTypeSettings() {
  const { recurrence } = useAppointmentEditor();

  if (!recurrence) return null;

  return (
    <div className="flex flex-wrap gap-2 px-4 pb-2">
      <Divider />
      <RecurrenceInterval />
      <RecurrenceFrequency />
      <WeekdaySelector />
      <RecurrenceMonthlySettings />
      <RecurrenceUntil />
    </div>
  );
}
