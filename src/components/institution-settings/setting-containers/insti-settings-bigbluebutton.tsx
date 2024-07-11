import { useState } from "react";
import { useTranslation } from "react-i18next";
import { uploadInstitutionSettings } from "@/src/client-functions/client-institution-settings";
import Input from "@/src/components/reusable/input";
import Title from "@/src/components/reusable/title";
import SettingsSection from "../../reusable/settings/settings-section";
import { useInstitutionSettings } from "../zustand";

export default function BigBlueButton() {
  const { t } = useTranslation("page");
  const { institutionSettings, updateInstitutionSettings } =
    useInstitutionSettings();
  const [changed, setChanged] = useState(false);

  return (
    <SettingsSection
      title="organization_settings.bigbluebutton_title"
      subtitle="organization_settings.bigbluebutton_subtitle"
      footerButtonText="general.save"
      footerButtonDisabled={!changed}
      footerButtonAction={async () => {
        await uploadInstitutionSettings(institutionSettings);
        setChanged(false);
      }}
    >
      <Title
        type="h6"
        text="organization_settings.bigbluebutton_input1_title"
        className="mb-1"
      />
      <Input
        text={institutionSettings.bigbluebutton_api_url || ""}
        setText={(url) => {
          updateInstitutionSettings({
            bigbluebutton_api_url: url,
          });
          setChanged(true);
        }}
        placeholder="organization_settings.bigbluebutton_input1_placeholder"
      />
      <Title
        type="h6"
        text="organization_settings.bigbluebutton_input2_title"
        className="mb-1 mt-5"
      />
      <Input
        text={institutionSettings.bigbluebutton_api_secret || ""}
        setText={(secret) => {
          updateInstitutionSettings({
            bigbluebutton_api_secret: secret,
          });
          setChanged(true);
        }}
        placeholder="organization_settings.bigbluebutton_input2_placeholder"
        password
      />
      <Title
        type="h6"
        text="organization_settings.bigbluebutton_description_question"
        className="mb-1 mt-7"
      />
      <p className="text-sm text-muted-contrast">
        {t("organization_settings.bigbluebutton_description_text1")}{" "}
        <a
          href="https://biggerbluebutton.com"
          target="_blank"
          rel="noreferrer"
          className="text-primary underline"
        >
          {t("organization_settings.bigbluebutton_description_text2")}
        </a>{" "}
        {t("organization_settings.bigbluebutton_description_text3")}
      </p>
    </SettingsSection>
  );
}
