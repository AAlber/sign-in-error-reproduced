import { useTranslation } from "react-i18next";
import useUser from "@/src/zustand/user";
import { Tabs, TabsList, TabsTrigger } from "../../reusable/shadcn-ui/tabs";
import type { SCHEDULE_DISPLAY } from "../zustand";
import useSchedule from "../zustand";

export const TabViewSelector = () => {
  const { setFullScreenView, fullScreenView, setSelectedDay, selectedDay } =
    useSchedule();
  const { user } = useUser();
  const { t } = useTranslation("page");
  return (
    <Tabs
      defaultValue={"week"}
      value={fullScreenView}
      onValueChange={(view) => {
        const scheduleView = view as SCHEDULE_DISPLAY;
        setFullScreenView(scheduleView);
        if (scheduleView === "day")
          setSelectedDay(new Date(selectedDay.setHours(0, 0, 0, 0)));
      }}
    >
      <TabsList className="w-full">
        <TabsTrigger className="w-full" value="day">
          {t("day")}
        </TabsTrigger>
        <TabsTrigger className="w-full" value="week">
          {t("week")}
        </TabsTrigger>
        {user.institution?.institutionSettings.addon_schedule_monitor && (
          <TabsTrigger className="w-full" value="monitor">
            {t("Monitor")}
          </TabsTrigger>
        )}
      </TabsList>
    </Tabs>
  );
};
