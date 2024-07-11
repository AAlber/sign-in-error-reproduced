import { ArrowRight, HelpCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import classNames from "@/src/client-functions/client-utils";
import Form from "@/src/components/reusable/formlayout";
import { Button } from "@/src/components/reusable/shadcn-ui/button";
import { Label } from "@/src/components/reusable/shadcn-ui/label";
import WithToolTip from "@/src/components/reusable/with-tooltip";
import usePlanner from "../../zustand";
import TimeSlotCustomAppointmentOptions from "./custom-appointment-options";
import TimeSlotSelects from "./selectors";

export const TimeSlotTimeArea = ({ index }) => {
  const { t } = useTranslation("page");
  const { constraints, updateTimeSlot } = usePlanner();

  return (
    <Form>
      <Form.FullWidthItem>
        <Label
          className={classNames("col-span-1 flex flex-col justify-start gap-1")}
        >
          <div className="relative flex w-full items-center gap-1">
            {t("time_area")}
            <WithToolTip text={t("time_area_tooltip")}>
              <Button variant={"ghost"} size={"iconSm"}>
                <HelpCircle className="size-3.5 text-muted-contrast" />
              </Button>
            </WithToolTip>
          </div>
        </Label>
        <div className="flex w-full items-center gap-2 text-sm text-contrast">
          <TimeSlotSelects.SelectTimeArea
            triggerValue={`${String(
              constraints.availableTimeSlots[index]?.startTime.hour,
            ).padStart(2, "0")}:${String(
              constraints.availableTimeSlots[index]?.startTime.minute,
            ).padStart(2, "0")}`}
            index={index}
            onValueChange={(value) =>
              updateTimeSlot(index, {
                ...constraints.availableTimeSlots[index]!,
                startTime: {
                  hour: parseInt(value.split(":")[0]!),
                  minute: parseInt(value.split(":")[1]!),
                },
              })
            }
          />

          <ArrowRight className="h-4 w-full text-muted-contrast" />
          <TimeSlotSelects.SelectTimeArea
            triggerValue={`${String(
              constraints.availableTimeSlots[index]?.endTime.hour,
            ).padStart(2, "0")}:${String(
              constraints.availableTimeSlots[index]?.endTime.minute,
            ).padStart(2, "0")}`}
            index={index}
            onValueChange={(value) =>
              updateTimeSlot(index, {
                ...constraints.availableTimeSlots[index]!,
                endTime: {
                  hour: parseInt(value.split(":")[0]!),
                  minute: parseInt(value.split(":")[1]!),
                },
              })
            }
          />
        </div>
      </Form.FullWidthItem>
      <Form.FullWidthItem>
        <TimeSlotCustomAppointmentOptions index={index} />
      </Form.FullWidthItem>
    </Form>
  );
};
