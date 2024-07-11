import { useTranslation } from "react-i18next";
import { RRule } from "rrule";
import { Button } from "../../../reusable/shadcn-ui/button";
import usePlanner from "../../zustand";
import { useAvailableTimeSlotSettings } from "./hooks";
import TimeSlotSelects from "./selectors";
import { TimeSlotTimeArea } from "./time-area";
import { TimeSlotWeekdaysButtons } from "./weekdays-buttons";

export default function AvailableTimeSlotSettings({ index }) {
  const { t } = useTranslation("page");
  const { constraints, removeTimeSlot } = usePlanner();
  const {
    selectedDays,
    setSelectedDays,
    selectedWeekOfMonth,
    setSelectedWeekOfMonth,
  } = useAvailableTimeSlotSettings(index);

  return (
    <div className="flex flex-col gap-4 px-4">
      <div className="flex items-center">
        <TimeSlotSelects.SelectTimeFrequency index={index} />
        {constraints.availableTimeSlots[index]?.rrule.options.freq ===
          RRule.MONTHLY && (
          <TimeSlotSelects.SelectTimeWeekSpan
            selectedWeekOfMonth={selectedWeekOfMonth}
            index={index}
            selectedDays={selectedDays}
            setSelectedWeekOfMonth={setSelectedWeekOfMonth}
          />
        )}
      </div>

      <TimeSlotWeekdaysButtons
        index={index}
        selectedDays={selectedDays}
        setSelectedDays={setSelectedDays}
      />
      <TimeSlotTimeArea index={index} />
      {constraints.availableTimeSlots.length > 1 && (
        <div className="w-full">
          <Button
            className="w-full text-destructive"
            variant="ghost"
            size={"small"}
            onClick={() => removeTimeSlot(index)}
          >
            {t("general.remove")}
          </Button>
        </div>
      )}
    </div>
  );
}
