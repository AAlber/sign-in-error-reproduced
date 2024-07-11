import useInstitutionSettingsScheduleMonitor from "../../institution-settings/setting-containers/insti-settings-schedule-monitor/zustand";
import MonitorDayDisplay from "./monitor";

type MonitorSelectorProps = {
  containerNav: React.RefObject<HTMLDivElement>;
};

export default function MonitorNavigation({
  containerNav,
}: MonitorSelectorProps) {
  const { layers } = useInstitutionSettingsScheduleMonitor();

  return (
    <div
      ref={containerNav}
      style={{ gridTemplateColumns: `repeat(${layers.length}, 1fr)` }}
      className={
        "sticky top-0 z-[100000] grid flex-none rounded-t-md border-b border-border bg-background pl-14 text-xs text-muted-contrast shadow-sm "
      }
    >
      <MonitorDayDisplay />
    </div>
  );
}
