import { useState } from "react";
import { uploadInstitutionSettings } from "@/src/client-functions/client-institution-settings";
import SettingsSection from "../../reusable/settings/settings-section";
import SwitchGroup from "../../reusable/settings-switches/switch-group";
import SwitchItem from "../../reusable/settings-switches/switch-item";
import { useInstitutionSettings } from "../zustand";

export default function Communication() {
  const [changed, setChanged] = useState(false);
  const { institutionSettings, updateInstitutionSettings } =
    useInstitutionSettings();

  return (
    <SettingsSection
      title="organization_settings.communication_title"
      subtitle="organization_settings.communication_subtitle"
      footerButtonText="general.save"
      footerButtonDisabled={!changed}
      footerButtonAction={async () => {
        await uploadInstitutionSettings(institutionSettings);
        setChanged(false);
      }}
    >
      <SwitchGroup>
        <SwitchItem
          label="organization_settings.communication_switch1_title"
          description="organization_settings.communication_switch1_text"
          checked={institutionSettings.communication_messaging}
          onChange={() => {
            setChanged(true);
            updateInstitutionSettings({
              communication_messaging:
                !institutionSettings.communication_messaging,
            });
          }}
        />
        <SwitchItem
          label="organization_settings.communication_switch2_title"
          description="organization_settings.communication_switch2_text"
          checked={institutionSettings.communication_course_chat}
          onChange={() => {
            setChanged(true);
            updateInstitutionSettings({
              communication_course_chat:
                !institutionSettings.communication_course_chat,
            });
          }}
        />
      </SwitchGroup>
    </SettingsSection>
  );
}
