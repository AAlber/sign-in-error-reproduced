import { useEffect } from "react";
import Box from "@/src/components/reusable/box";
import SwitchItem from "@/src/components/reusable/settings-switches/switch-item";
import { handleSetReurrence } from "../../functions";
import useAppointmentEditor from "../../zustand";
import RecurrenceTypeSettings from "./recurrence-type-settings";

export default function AppointmentRecurrenceOptions() {
  const { recurrence, setRecurrence, initSource } = useAppointmentEditor();

  useEffect(() => {
    if (recurrence === null || initSource !== "settings") return;
    handleSetReurrence();
  }, []);

  return (
    <div className="col-span-4">
      <div className="w-full">
        <Box noPadding>
          <div className="px-1">
            <SwitchItem
              label="appointment_modal.recurrence_label"
              description="appointment_modal.recurrence_description"
              checked={recurrence !== null}
              onChange={(checked) => {
                if (checked) {
                  handleSetReurrence();
                } else {
                  setRecurrence(null);
                }
              }}
            />
          </div>
          <RecurrenceTypeSettings />
        </Box>
      </div>
    </div>
  );
}
