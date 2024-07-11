import { uploadInstitutionSettings } from "@/src/client-functions/client-institution-settings";
import SettingsItemWithDescription from "@/src/components/reusable/settings-select";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/reusable/shadcn-ui/select";
import { useInstitutionSettings } from "../../zustand";

export default function MonitorPageSettings() {
  const { institutionSettings, updateInstitutionSettings } =
    useInstitutionSettings();

  const splitOptions = [
    "No pages",
    "Every 2 layers",
    "Every 5 layers",
    "Every 10 layers",
    "Every 20 layers",
  ];

  return (
    <SettingsItemWithDescription
      title="organization_settings.schedule_monitor_break_columns_title"
      description="organization_settings.schedule_monitor_break_columns_description"
    >
      <Select
        defaultValue="No pages"
        value={
          institutionSettings.schedule_monitor_split_every === 0
            ? `No pages`
            : `Every ${institutionSettings.schedule_monitor_split_every} layers`
        }
        onValueChange={(value) => {
          updateInstitutionSettings({
            schedule_monitor_split_every:
              value === "No pages" ? 0 : parseInt(value.split(" ")[1]!),
          });
          setTimeout(
            () =>
              uploadInstitutionSettings({
                ...institutionSettings,
                schedule_monitor_split_every:
                  value === "No pages" ? 0 : parseInt(value.split(" ")[1]!),
              }),
            50,
          );
        }}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select" />
        </SelectTrigger>
        <SelectContent>
          {splitOptions.map((option) => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </SettingsItemWithDescription>
  );
}
