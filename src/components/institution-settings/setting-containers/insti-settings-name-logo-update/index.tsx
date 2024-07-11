import { useUser as useClerkUser } from "@clerk/nextjs";
import { useState } from "react";
import { updateInstitutionGeneralInfo } from "@/src/client-functions/client-institution";
import { uploadInstitutionSettings } from "@/src/client-functions/client-institution-settings";
import { updateIntitutionTheme } from "@/src/client-functions/client-institution-theme";
import { updateCustomerLanguage } from "@/src/client-functions/client-stripe";
import LanguageSelector from "@/src/components/admin-dashboard/top-right-menu/common-form/language-selector";
import useThemeStore from "@/src/components/dashboard/navigation/primary-sidebar/user-menu/theme-switcher/zustand";
import SettingsSection from "@/src/components/reusable/settings/settings-section";
import useUser from "@/src/zustand/user";
import { useInstitutionSettings } from "../../zustand";
import LogoComponent from "./logo";
import InstitutionNameInput from "./name-input";
import ThemeSelector from "./theme-selector";
import useInstitutionBasicInfo from "./zustand";

const NameLogoSettings = () => {
  const userId = useClerkUser().user?.id;
  const { user: data } = useUser();
  const { nameState } = useInstitutionBasicInfo();
  const { institutionSettings, updateInstitutionSettings } =
    useInstitutionSettings();
  const { nameChanged, setNameChanged, institutionName } = nameState;
  const { instiTheme, setThemeChanged, themeChanged, customTheme } =
    useThemeStore();
  const [languageChanged, setLanguageChanged] = useState(false);
  const resetGeneralSettings = () => {
    setNameChanged(false);
    setThemeChanged(false);
    setLanguageChanged(false);
  };

  return (
    <SettingsSection
      title="organization_settings.name_logo_title"
      subtitle="organization_settings.name_logo_subtitle"
      footerButtonText="general.save"
      footerButtonDisabled={!nameChanged && !themeChanged && !languageChanged}
      footerButtonAction={async () => {
        if (nameChanged) {
          await updateInstitutionGeneralInfo({
            name: institutionName,
          });
        }
        if (languageChanged) {
          await uploadInstitutionSettings(institutionSettings);
          await updateCustomerLanguage({
            language: institutionSettings.institution_language,
          });
        }
        if (themeChanged) {
          if (instiTheme === "custom") {
            await updateIntitutionTheme(instiTheme, customTheme);
          } else {
            await updateIntitutionTheme(instiTheme);
          }
        }
        resetGeneralSettings();
      }}
    >
      <div className="divide-y divide-white/5">
        <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 md:col-span-2 md:grid-cols-3">
          <div className="md:col-span-2">
            <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-xl">
              <LogoComponent {...data} />
              <InstitutionNameInput {...data} />
              <ThemeSelector />
              <div className="grid w-full gap-4">
                <LanguageSelector className={"flex flex-col gap-2"}>
                  <LanguageSelector.LabelSection label="invoice_language" />
                  <LanguageSelector.SelectSection
                    language={institutionSettings.institution_language}
                    setLanguage={(lang) =>
                      updateInstitutionSettings({
                        institution_language: lang,
                      })
                    }
                    setLanguageChanged={setLanguageChanged}
                  />
                </LanguageSelector>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SettingsSection>
  );
};

export default NameLogoSettings;
