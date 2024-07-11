import { useState } from "react";
import { uploadInstitutionSettings } from "@/src/client-functions/client-institution-settings";
import SettingsSection from "../../reusable/settings/settings-section";
import SwitchGroup from "../../reusable/settings-switches/switch-group";
import SwitchItem from "../../reusable/settings-switches/switch-item";
import { useInstitutionSettings } from "../zustand";

export default function StatementOfIndependence() {
  const [changed, setChanged] = useState(false);
  const { institutionSettings, updateInstitutionSettings } =
    useInstitutionSettings();

  return (
    <SettingsSection
      title="statement_of_independence"
      subtitle="statement_of_independence_required_description"
      footerButtonText="general.save"
      footerButtonDisabled={!changed}
      footerButtonAction={async () => {
        await uploadInstitutionSettings(institutionSettings);
        setChanged(false);
      }}
    >
      <SwitchGroup>
        <SwitchItem
          label="require_statement_of_independence"
          // description="organization_settings.communication_switch1_text"
          checked={institutionSettings.statement_of_independence_required}
          onChange={() => {
            setChanged(true);
            updateInstitutionSettings({
              statement_of_independence_required:
                !institutionSettings.statement_of_independence_required,
            });
          }}
        />
      </SwitchGroup>
    </SettingsSection>
  );
}
