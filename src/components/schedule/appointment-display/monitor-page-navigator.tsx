import { ChevronLeft, ChevronRight } from "lucide-react";
import useInstitutionSettingsScheduleMonitor from "../../institution-settings/setting-containers/insti-settings-schedule-monitor/zustand";
import { useInstitutionSettings } from "../../institution-settings/zustand";
import useSchedule from "../zustand";

export default function MonitorPageNavigator() {
  const { institutionSettings } = useInstitutionSettings();
  const { page, setPage, allLayers } = useInstitutionSettingsScheduleMonitor();
  const { appointments } = useSchedule();

  if (institutionSettings.schedule_monitor_split_every === 0) return null;

  const maxPage =
    Math.ceil(
      allLayers.filter((layer) => {
        if (institutionSettings.schedule_monitor_show_empty_columns)
          return true;
        return appointments.some(
          (appointment) =>
            (appointment as any).originalLayerId === layer.layerId,
        );
      }).length / institutionSettings.schedule_monitor_split_every,
    ) - 1;

  if (maxPage < 1) return null;

  return (
    <div className="pointer-events-auto absolute bottom-2 right-2 z-50 flex items-center rounded-md border border-border bg-background ">
      <button
        className="flex h-8 w-8 items-center justify-center disabled:opacity-50"
        onClick={() => setPage(page - 1)}
        disabled={page === 0}
      >
        <ChevronLeft className="h-4 w-4 text-muted-contrast" />
      </button>
      <div className="flex h-8 w-8 items-center justify-center text-sm text-muted-contrast">
        {page + 1} / {maxPage + 1}
      </div>
      <button
        className="flex h-8 w-8 items-center justify-center disabled:opacity-50"
        onClick={() => setPage(page + 1)}
        disabled={page === maxPage}
      >
        <ChevronRight className="h-4 w-4 text-muted-contrast" />
      </button>
    </div>
  );
}
