import { useTranslation } from "react-i18next";
import { RRule } from "rrule";
import {
  freqToString,
  stringToFreq,
} from "@/src/client-functions/client-rrule-utils";
import classNames from "@/src/client-functions/client-utils";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
} from "@/src/components/reusable/shadcn-ui/select";
import usePlanner from "../../../zustand";

const availableFreqs = ["WEEKLY", "WEEKLY_2", "MONTHLY"];

export const SelectTimeFrequency = ({ index }) => {
  const { t } = useTranslation("page");
  const { constraints, updateTimeSlot } = usePlanner();

  const handleUpdateFrequency = (value) => {
    console.log(value);
    const freqValue = stringToFreq(value);
    if (freqValue === null) return;

    let interval = 1;
    if (freqValue === RRule.WEEKLY && value === "time_slot_weekly_2") {
      interval = 2;
    }

    updateTimeSlot(index, {
      ...constraints.availableTimeSlots[index]!,
      rrule: new RRule({
        ...constraints.availableTimeSlots[index]!.rrule.options,
        freq: freqValue,
        interval,
        bysetpos: null,
      }),
    });
  };

  return (
    <Select
      value={freqToString(
        constraints.availableTimeSlots[index]!.rrule.options.freq,
        constraints.availableTimeSlots[index]?.rrule.options.interval,
      )}
      onValueChange={handleUpdateFrequency}
    >
      <SelectTrigger
        className={classNames(
          "focus:ring-0",
          constraints.availableTimeSlots[index]?.rrule.options.freq !==
            RRule.MONTHLY
            ? "w-full"
            : "rounded-r-none border-r-0",
        )}
      >
        {t(
          freqToString(
            constraints.availableTimeSlots[index]!.rrule.options.freq,
            constraints.availableTimeSlots[index]?.rrule.options.interval,
          ),
        )}
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {availableFreqs.map((freq) => (
            <SelectItem key={freq} value={freq}>
              {t(freq)}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

SelectTimeFrequency.displayName = "SelectTimeFrequency";
