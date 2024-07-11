import { useTranslation } from "react-i18next";
import getInstitutionSettingsTabs from "@/src/components/institution-settings/tabs";
import { useNavigation } from "../../../zustand";
import FinderSection from "../finder-section";
import useFinder from "../zustand";

export default function SectionSettings() {
  const { t } = useTranslation("page");
  const { setOpen } = useFinder();
  const { navigateToTab: navigatorToTab, setPage: setPageZustand } =
    useNavigation();

  function setPage(page: PageKey) {
    setPageZustand(page);
    setOpen(false);
  }

  return (
    <FinderSection<SettingsTab>
      title={t("settings")}
      rolesRequired={["admin"]}
      items={getInstitutionSettingsTabs().map((tab) => {
        return {
          icon: <>{tab.icon}</>,
          title: t(tab.name),
          item: tab,
          onSelect: () => {
            setPage("ORGANIZATION_SETTINGS");
            navigatorToTab(tab.name.replace(" ", "-"));
          },
        };
      })}
    />
  );
}
