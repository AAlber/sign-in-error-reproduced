import { useState } from "react";
import { useTranslation } from "react-i18next";
import { uploadInstitutionSettings } from "@/src/client-functions/client-institution-settings";
import SwitchGroup from "@/src/components/reusable/settings-switches/switch-group";
import SwitchItem from "@/src/components/reusable/settings-switches/switch-item";
import SettingsSection from "../../../reusable/settings/settings-section";
import { Input } from "../../../reusable/shadcn-ui/input";
import { Label } from "../../../reusable/shadcn-ui/label";
import { useInstitutionSettings } from "../../zustand";
import OrganizerInfoSelect from "./organizer-info-select";

const AppointmentSettings = () => {
  const [changed, setChanged] = useState(false);
  const { institutionSettings, updateInstitutionSettings } =
    useInstitutionSettings();

  const { t } = useTranslation("page");

  return (
    <SettingsSection
      title="organization_settings.appointment"
      subtitle="organization_settings.appointment_subtitle"
      footerButtonText="general.save"
      footerButtonDisabled={!changed}
      footerButtonAction={async () => {
        await uploadInstitutionSettings(institutionSettings);
        setChanged(false);
      }}
    >
      <ul className="mb-4 flex grid-cols-2 flex-col gap-4 xl:grid">
        <li>
          <Label>
            {t("organization_settings.appointment_organizer_display")}
          </Label>
          <OrganizerInfoSelect onChange={() => setChanged(true)} />
          <p className="mt-2 text-xs text-muted-contrast">
            {t("organization_settings.appointment_organizer_display_desc")}
          </p>
        </li>
        <li>
          <Label>
            {t("organization_settings.appointment_default_duration")}
          </Label>
          <Input
            type="number"
            className="mt-2"
            value={institutionSettings.appointment_default_duration}
            onChange={(e) => {
              setChanged(true);
              updateInstitutionSettings({
                appointment_default_duration: parseInt(e.target.value),
              });
            }}
          />
        </li>
      </ul>
      <SwitchGroup>
        <SwitchItem
          label="appointment_default_offline"
          description="appointment_default_offline_desc"
          checked={institutionSettings.appointment_default_offline}
          onChange={() => {
            setChanged(true);
            updateInstitutionSettings({
              appointment_default_offline:
                !institutionSettings.appointment_default_offline,
            });
          }}
        />
      </SwitchGroup>
    </SettingsSection>
  );
};

export default AppointmentSettings;
