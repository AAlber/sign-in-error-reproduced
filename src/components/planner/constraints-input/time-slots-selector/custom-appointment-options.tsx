import { useTranslation } from "react-i18next";
import classNames from "@/src/client-functions/client-utils";
import DurationSelector from "@/src/components/popups/appointment-editor/appointment-datetime-input/recurrence-options/duration-selector";
import AdvancedOptionReveal from "@/src/components/reusable/advanced-options-reveal";
import Form from "@/src/components/reusable/formlayout";
import { Checkbox } from "@/src/components/reusable/shadcn-ui/checkbox";
import { Label } from "@/src/components/reusable/shadcn-ui/label";
import WithToolTip from "@/src/components/reusable/with-tooltip";
import type { AvailableTimeSlot } from "@/src/types/planner/planner-constraints.types";
import { defaultOptions } from "@/src/types/planner/planner-constraints.types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../reusable/shadcn-ui/select";
import { canHaveOfflineAppointments } from "../../functions";
import usePlanner from "../../zustand";

export default function TimeSlotCustomAppointmentOptions({
  index,
}: {
  index: number;
}) {
  const { layers, constraints, updateTimeSlot } = usePlanner();
  const { t } = useTranslation("page");
  const timeSlot = constraints.availableTimeSlots[index]!;

  const usesCustomOptions = timeSlot.mode === "use-custom-options";
  const updatedOptionsOnSwitch: AvailableTimeSlot = usesCustomOptions
    ? {
        ...timeSlot,
        mode: "use-default-options",
      }
    : {
        ...timeSlot,
        mode: "use-custom-options",
        options: constraints.options,
      };

  const durationToShow = usesCustomOptions
    ? timeSlot.options.duration
    : constraints.options.duration;
  const typeToShow = usesCustomOptions
    ? timeSlot.options.type
    : constraints.options.type;

  return (
    <AdvancedOptionReveal className="-mt-4">
      <div className="col-span-4 mb-4 space-y-1">
        <div className="flex items-center justify-between">
          <Label>{t("planner_custom_appointment_title")}</Label>
          <Checkbox
            checked={usesCustomOptions}
            onCheckedChange={() =>
              updateTimeSlot(index, updatedOptionsOnSwitch)
            }
          />
        </div>
        <div>{t("planner_custom_appointment_subtitle")}</div>
      </div>
      <div
        className={classNames(
          !usesCustomOptions && "pointer-events-none opacity-60",
        )}
      >
        <Form>
          <Form.Item
            label="planner_title_duration_title"
            description="planner_custom_appointment_description"
          >
            <DurationSelector
              value={durationToShow}
              onChange={(value) =>
                updateTimeSlot(index, {
                  ...timeSlot,
                  mode: "use-custom-options",
                  options: usesCustomOptions
                    ? {
                        ...timeSlot.options,
                        duration: value,
                      }
                    : defaultOptions,
                })
              }
            />
          </Form.Item>
          <Form.Item
            label="planner_type_title"
            description="planner_title_type_description"
          >
            <WithToolTip
              disabled={canHaveOfflineAppointments(layers)}
              text="planner.offline-no-rooms-selected"
            >
              <Select
                value={typeToShow}
                disabled={!canHaveOfflineAppointments(layers)}
                onValueChange={(value) =>
                  updateTimeSlot(index, {
                    ...timeSlot,
                    mode: "use-custom-options",
                    options: usesCustomOptions
                      ? {
                          ...timeSlot.options,
                          type: value as "online" | "offline",
                        }
                      : defaultOptions,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={"online"}>{"Online"}</SelectItem>
                  <SelectItem value={"offline"}>{"Offline"}</SelectItem>
                </SelectContent>
              </Select>
            </WithToolTip>
          </Form.Item>
        </Form>
      </div>
    </AdvancedOptionReveal>
  );
}
