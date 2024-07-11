import { Building, LifeBuoy, StarIcon, Tv2 } from "lucide-react";
import { uploadInstitutionSettingsWithProcessToast } from "@/src/client-functions/client-institution-settings";
import { useInstitutionSettings } from "../zustand";
import AddOn from "./add-on";

export default function Marketplace() {
  const { institutionSettings, updateInstitutionSettings } =
    useInstitutionSettings();

  return (
    <div className="grid grid-cols-2 gap-4 p-4 max-xl:max-w-[700px] max-lg:max-w-[900px] xl:grid-cols-3 2xl:grid-cols-4">
      <AddOn
        icon={<Building className="h-6 w-6 text-contrast" />}
        title="organization_settings.add_ons_room_management_title"
        subtitle="organization_settings.add_ons_room_management_subtitle"
        active={institutionSettings.addon_room_management}
        onToggle={(checked) => {
          updateInstitutionSettings({
            addon_room_management: checked,
          });
          uploadInstitutionSettingsWithProcessToast({
            ...institutionSettings,
            addon_room_management: checked,
          });
        }}
        settingsPage={7}
      />
      <AddOn
        icon={<LifeBuoy className="h-6 w-6 text-fuxam-orange" />}
        title="organization_settings.add_ons_support_contact_title"
        subtitle="organization_settings.add_ons_support_contact_subtitle"
        active={institutionSettings.addon_support_contact}
        onToggle={(checked) => {
          updateInstitutionSettings({
            addon_support_contact: checked,
          });
          uploadInstitutionSettingsWithProcessToast({
            ...institutionSettings,
            addon_support_contact: checked,
          });
        }}
        settingsPage={6}
      />
      <AddOn
        icon={<StarIcon className="h-6 w-6 text-yellow-500" />}
        title="organization_settings.add_ons_lms_feedback_title"
        subtitle="organization_settings.add_ons_lms_feedback_subtitle"
        active={institutionSettings.addon_lms_feedbacks}
        onToggle={(checked) => {
          updateInstitutionSettings({
            addon_lms_feedbacks: checked,
            feedback_course: checked,
            feedback_content_blocks: checked,
          });
          uploadInstitutionSettingsWithProcessToast({
            ...institutionSettings,
            addon_lms_feedbacks: checked,
            feedback_course: checked,
            feedback_content_blocks: checked,
          });
        }}
        settingsPage={8}
      />
      <AddOn
        icon={<Tv2 className="h-6 w-6 text-contrast" />}
        title="organization_settings.add_ons_schedule_monitor_title"
        subtitle="organization_settings.add_ons_schedule_monitor_subtitle"
        active={institutionSettings.addon_schedule_monitor}
        onToggle={(checked) => {
          updateInstitutionSettings({
            addon_schedule_monitor: checked,
          });
          uploadInstitutionSettingsWithProcessToast({
            ...institutionSettings,
            addon_schedule_monitor: checked,
          });
        }}
        settingsPage={9}
      />
    </div>
  );
}
