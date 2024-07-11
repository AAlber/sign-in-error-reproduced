import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { refreshMonitorLayers } from "@/src/client-functions/client-schedule-monitor";
import { useNavigation } from "@/src/components/dashboard/navigation/zustand";
import Box from "@/src/components/reusable/box";
import SettingsSection from "@/src/components/reusable/settings/settings-section";
import TickGroup from "@/src/components/reusable/settings-ticks/tick-group";
import useSchedule from "@/src/components/schedule/zustand";
import useScheduleSlider from "@/src/components/schedule-slider/zustand";
import Skeleton from "@/src/components/skeleton";
import MonitorEmptyColumnSettings from "./monitor-empty-column-settings";
import MonitorLayerList from "./monitor-layer-list";
import MonitorLayerSelector from "./monitor-layer-selector";
import MonitorPageSettings from "./monitor-page-settings";
import useInstitutionSettingsScheduleMonitor from "./zustand";

export default function ScheduleMonitor() {
  const { layers, loading, setLoading } =
    useInstitutionSettingsScheduleMonitor();
  const { open } = useScheduleSlider();
  const { setFullScreenView } = useSchedule();
  const { setPage } = useNavigation();
  const { t } = useTranslation("page");

  useEffect(() => {
    setLoading(true);
    refreshMonitorLayers().then(() => setLoading(false));
  }, [open]);

  return (
    <SettingsSection
      title="organization_settings.schedule_monitor_title"
      subtitle="organization_settings.schedule_monitor_subtitle"
      footerButtonText="organization_settings.schedule_monitor_button"
      footerButtonDisabled={layers.length === 0}
      footerButtonAction={async () => {
        setFullScreenView("monitor");
        setPage("CALENDAR");
      }}
    >
      <MonitorLayerSelector />
      <Box noPadding>
        <div className="w-full">
          {loading && <Skeleton />}
          {!loading && layers.length === 0 && (
            <div className="flex items-center justify-between py-3 text-center">
              <p className="w-full text-sm text-muted-contrast">
                {t("organization_settings.schedule_monitor_not_found")}
              </p>
            </div>
          )}
          {!loading && layers && <MonitorLayerList />}
        </div>
      </Box>
      <div className="h-2" />
      <TickGroup>
        <MonitorEmptyColumnSettings />
        <MonitorPageSettings />
      </TickGroup>
    </SettingsSection>
  );
}
