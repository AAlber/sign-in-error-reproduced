import React, { useState } from "react";
import { uploadInstitutionSettingsWithProcessToast } from "@/src/client-functions/client-institution-settings";
import SettingsSection from "@/src/components/reusable/settings/settings-section";
import SwitchGroup from "@/src/components/reusable/settings-switches/switch-group";
import SwitchItem from "@/src/components/reusable/settings-switches/switch-item";
import type { InstitutionSettings } from "@/src/types/institution-settings.types";
import { useInstitutionSettings } from "../zustand";

const CourseFeedback = () => {
  const { institutionSettings } = useInstitutionSettings();
  const { feedback_content_blocks, addon_lms_feedbacks, feedback_course } =
    institutionSettings;

  const [enabled, setEnabled] = useState<
    Pick<InstitutionSettings, "feedback_content_blocks" | "feedback_course">
  >({
    feedback_content_blocks: addon_lms_feedbacks && feedback_content_blocks,
    feedback_course: addon_lms_feedbacks && feedback_course,
  });

  const { updateInstitutionSettings } = useInstitutionSettings();

  const handleSave = async () => {
    const newSettings: InstitutionSettings = {
      ...institutionSettings,
      feedback_course: enabled.feedback_course,
      feedback_content_blocks: enabled.feedback_content_blocks,
    };

    await uploadInstitutionSettingsWithProcessToast(newSettings);
    updateInstitutionSettings(newSettings);
  };

  return (
    <SettingsSection
      title="organization_settings.feedback_title"
      subtitle="organization_settings.feedback_subtitle"
      footerButtonText="general.save"
      footerButtonAction={handleSave}
      footerButtonDisabled={false}
    >
      <SwitchGroup>
        <SwitchItem
          label="organization_settings.feedback_switch_course"
          description="organization_settings.feedback_switch_course_text"
          checked={enabled?.feedback_course}
          onChange={(value) => {
            setEnabled((prev) => ({ ...prev, feedback_course: value }));
          }}
        />
        <SwitchItem
          label="organization_settings.feedback_switch_content"
          description="organization_settings.feedback_switch_content_text"
          checked={enabled.feedback_content_blocks}
          onChange={(value) => {
            setEnabled((prev) => ({ ...prev, feedback_content_blocks: value }));
          }}
        />
      </SwitchGroup>
    </SettingsSection>
  );
};

export default CourseFeedback;
