import { useTranslation } from "react-i18next";
import ThemeSelectorMain from "../../../institution-settings/setting-containers/insti-settings-name-logo-update/theme-selector/theme-selector-main";

export default function ThemeSelectorField() {
  const { t } = useTranslation("page");

  return (
    <div className="grid grid-cols-3">
      <label
        htmlFor="theme-selector"
        className="block text-sm font-medium text-contrast"
      >
        {t("color")}
      </label>
      <div className="col-span-2 flex flex-row items-end justify-end">
        <div>
          <ThemeSelectorMain />
        </div>
      </div>
    </div>
  );
}
