import { Info } from "lucide-react";
import { useTranslation } from "react-i18next";
import { LoadingSparkles } from "@/src/components/reusable/loading-sparkles";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/src/components/reusable/shadcn-ui/accordion";
import { Button } from "@/src/components/reusable/shadcn-ui/button";
import WithToolTip from "@/src/components/reusable/with-tooltip";
import usePlanner from "../../zustand";
import { ContraintPreferenceItem } from "../contraint-preference-item";
import AvailableTimeSlotSettings from "./time-slot";

export default function AvailableTimeSlotsSelector() {
  const { t } = useTranslation("page");
  const { aiLoading, constraints, addTimeSlot } = usePlanner();

  return (
    <ContraintPreferenceItem
      fullWidth
      title={t("planer_time_slots_title")}
      description={t("planner_time_slots_description")}
    >
      <div className="relative w-full overflow-hidden rounded-md border border-border">
        <LoadingSparkles
          loading={aiLoading}
          particleDensity={500}
          id="timeslots"
        >
          <Accordion
            type="single"
            collapsible
            className="w-full"
            defaultValue="0"
          >
            {constraints.availableTimeSlots.map((timeSlot, index) => (
              <AccordionItem key={index} value={index.toString()}>
                <AccordionTrigger className="py-2 pr-2">
                  <div className="flex items-center justify-start gap-1 px-4">
                    <p>
                      {t("planner_timeslot")} {index + 1}
                    </p>
                    <WithToolTip text={t(timeSlot.rrule.toText())}>
                      <Button variant={"ghost"} size={"iconSm"}>
                        <Info className="size-3.5 text-muted-contrast" />
                      </Button>
                    </WithToolTip>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <AvailableTimeSlotSettings index={index} />
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          <Button
            className="w-full rounded-none"
            variant={"ghost"}
            onClick={addTimeSlot}
          >
            {t("add_time_slot")}
          </Button>
        </LoadingSparkles>
      </div>
    </ContraintPreferenceItem>
  );
}
