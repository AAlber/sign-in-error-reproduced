import { endOfWeek, isWithinInterval, startOfWeek } from "date-fns";
import { Blocks, Plus } from "lucide-react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { selectCurrentWeek } from "@/src/client-functions/client-schedule";
import usePlanner from "../../planner/zustand";
import useAppointmentEditor from "../../popups/appointment-editor/zustand";
import AccessGate from "../../reusable/access-gate";
import DateTimePicker from "../../reusable/date-time-picker";
import { Button } from "../../reusable/shadcn-ui/button";
import ScheduleFilter from "../filter";
import { MonitorFullscreenButton } from "../monitor-fullscreen-button";
import useSchedule from "../zustand";
import LearnSchedule from "./schedule-learn";
import { ScheduleSearch } from "./schedule-search";
import { TabViewSelector } from "./tab-view-selector";

export default function ToolbarItems() {
  const {
    appointments,
    plannerOpen,
    selectedDay,
    setPlannerOpen,
    setSelectedDay,
    fullScreenView,
    setAppointments,
  } = useSchedule();
  const { init: initApppointmentEditor } = useAppointmentEditor();
  const isMonitor = fullScreenView === "monitor";
  const { t } = useTranslation("page");

  const { reset } = usePlanner();

  const isSelectedDayInCurrentWeek = (selectedDay: Date) => {
    const now = new Date();
    const startOfCurrentWeek = startOfWeek(now, { weekStartsOn: 1 });
    const endOfCurrentWeek = endOfWeek(now, { weekStartsOn: 1 });

    return isWithinInterval(new Date(selectedDay), {
      start: startOfCurrentWeek,
      end: endOfCurrentWeek,
    });
  };

  useEffect(() => {
    if (plannerOpen) return;
    setAppointments(appointments.filter((a) => a.type !== "draft"));
    reset();
  }, [plannerOpen]);

  return (
    <div
      className={
        "relative flex items-center justify-between border-border py-2"
      }
    >
      <div className="flex w-full items-center gap-2">
        <TabViewSelector />
        <div className="w-auto">
          <DateTimePicker
            hideButtons={false}
            placeholder="Choose date and time"
            value={selectedDay}
            position="bottom"
            onChange={(date) => {
              if (!date) return setSelectedDay(selectedDay);
              setSelectedDay(date);
              selectCurrentWeek(date);
            }}
            resetDateButton={
              !isSelectedDayInCurrentWeek(selectedDay) ? true : false
            }
            responsiveFormat
          />
        </div>
        <LearnSchedule />
      </div>
      {!isMonitor && (
        <div className="flex w-auto max-w-[600px] items-center justify-end gap-2">
          <div className="w-[200px]">
            <ScheduleSearch />
          </div>
          <ScheduleFilter />
          <AccessGate
            checkWholeInstitutionForAccess
            rolesWithAccess={["admin", "educator", "moderator"]}
          >
            <>
              <Button
                variant={plannerOpen ? "cta" : "default"}
                onClick={() => setPlannerOpen(!plannerOpen)}
              >
                <Blocks className="mr-1 size-4" />
                Plan
              </Button>
              <Button onClick={() => initApppointmentEditor(undefined)}>
                <Plus className="mr-1 size-4" />
                {t("general.create")}
              </Button>
            </>
          </AccessGate>
        </div>
      )}
      {isMonitor && <MonitorFullscreenButton />}
    </div>
  );
}
