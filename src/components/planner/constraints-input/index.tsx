import { Wand2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import Form from "../../reusable/formlayout";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../reusable/shadcn-ui/tabs";
import { getConstraintDisabledCause, isConstraintsEnabled } from "../functions";
import { PlannerWrapper } from "../wrapper";
import usePlanner from "../zustand";
import AIFillOutPopover from "./ai-fillout";
import DurationsSelector from "./duration-selector";
import MaxPerDaySelector from "./max-per-day-selector";
import PreviewSettings from "./preview-settings";
import QuantitySelector from "./quantity-selector";
import Summary from "./summary";
import DateRangeSelector from "./time-range-selector";
import AvailableTimeSlotsSelector from "./time-slots-selector";
import TypeSelector from "./type-selector";

export default function ConstraintsPreferences() {
  const { t } = useTranslation("page");
  const [layers, tab, setTab] = usePlanner((state) => [
    state.layers,
    state.tab,
    state.setTab,
  ]);

  return (
    <PlannerWrapper
      id="constraints"
      title={t("planner_contains_and_preferences")}
      description={t("planner_contains_and_preferences_description")}
      disabledHint={getConstraintDisabledCause(layers)}
      disabled={isConstraintsEnabled(layers)}
    >
      <Tabs
        className="w-full px-4"
        value={tab}
        onValueChange={(value) => setTab(value as any)}
      >
        <TabsList className="w-full">
          <TabsTrigger className="w-full" value="automatic">
            <Wand2 className="mr-2 size-3.5" /> {t("planner_tab_auto")}
          </TabsTrigger>
          <TabsTrigger className="w-full" value="manual">
            {t("planner_tab_manual")}
          </TabsTrigger>
          <TabsTrigger className="w-full" value="summary">
            {t("planner_tab_summary")}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="manual" className="w-full pt-2">
          <PreviewSettings />
          <Form>
            <QuantitySelector />
            <DateRangeSelector />
            <DurationsSelector />
            <TypeSelector />
            <MaxPerDaySelector />
            <AvailableTimeSlotsSelector />
          </Form>
        </TabsContent>
        <TabsContent value="summary" className="w-full">
          <Summary />
        </TabsContent>
        <TabsContent value="automatic" className="w-full">
          <AIFillOutPopover />
        </TabsContent>
      </Tabs>
    </PlannerWrapper>
  );
}
