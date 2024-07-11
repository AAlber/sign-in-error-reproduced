import { Building, FileBadge2, StarIcon, Tv2, UserCheck } from "lucide-react";
import { uploadInstitutionSettingsWithProcessToast } from "@/src/client-functions/client-institution-settings";
import { SettingId } from "../tabs";
import { useInstitutionSettings } from "../zustand";
import AddOn from "./add-on";

export default function AddOns() {
  const { institutionSettings, updateInstitutionSettings } =
    useInstitutionSettings();

  return (
    <div className="grid  grid-cols-2 gap-4 p-4 max-xl:max-w-[700px] max-lg:max-w-[900px] xl:grid-cols-3 2xl:grid-cols-4">
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
        settingsPage={SettingId.RoomManagement}
      />
      <AddOn
        icon={<FileBadge2 className="h-6 w-6 text-contrast" />}
        title="organization_settings.add_ons_ects_title"
        subtitle="organization_settings.add_ons_ects_subtitle"
        active={institutionSettings.addon_ects_points}
        onToggle={(checked) => {
          updateInstitutionSettings({
            addon_ects_points: checked,
          });
          uploadInstitutionSettingsWithProcessToast({
            ...institutionSettings,
            addon_ects_points: checked,
          });
        }}
        settingsPage={SettingId.ECTSPoints}
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
        settingsPage={SettingId.CourseFeedback}
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
        settingsPage={SettingId.ScheduleMonitor}
      />
      <AddOn
        icon={<UserCheck className="h-6 w-6 text-contrast" />}
        title="organization_settings.peer_feedback"
        subtitle="organization_settings.peer_feedback_subtitle"
        active={institutionSettings.addon_peer_feedback}
        onToggle={(checked) => {
          updateInstitutionSettings({
            addon_peer_feedback: checked,
          });
          uploadInstitutionSettingsWithProcessToast({
            ...institutionSettings,
            addon_peer_feedback: checked,
          });
        }}
      />
    </div>
  );
}
