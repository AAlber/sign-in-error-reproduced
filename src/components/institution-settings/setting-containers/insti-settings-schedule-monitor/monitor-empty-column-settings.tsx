import { uploadInstitutionSettings } from "@/src/client-functions/client-institution-settings";
import TickItem from "@/src/components/reusable/settings-ticks/tick-item";
import { useInstitutionSettings } from "../../zustand";

export default function MonitorEmptyColumnSettings() {
  const { institutionSettings, updateInstitutionSettings } =
    useInstitutionSettings();

  return (
    <TickItem
      title="organization_settings.schedule_monitor_show_empty_colums_title"
      description="organization_settings.schedule_monitor_show_empty_colums_description"
      checked={institutionSettings.schedule_monitor_show_empty_columns}
      onChange={() => {
        uploadInstitutionSettings({
          ...institutionSettings,
          schedule_monitor_show_empty_columns:
            !institutionSettings.schedule_monitor_show_empty_columns,
        });
        updateInstitutionSettings({
          schedule_monitor_show_empty_columns:
            !institutionSettings.schedule_monitor_show_empty_columns,
        });
      }}
    />
  );
}
