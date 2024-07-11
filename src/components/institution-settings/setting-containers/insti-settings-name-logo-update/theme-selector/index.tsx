import { useTranslation } from "react-i18next";
import ThemeSelectorMain from "./theme-selector-main";

export default function ThemeSelector() {
  const { t } = useTranslation("page");

  return (
    <div className="col-span-full flex flex-col gap-2">
      <h1 className="text-sm font-semibold">
        {t("theme_settings_title")}
        <br />
        <span className="text-xs font-normal text-muted-contrast">
          {t("theme_settings_description")}
        </span>
      </h1>
      <ThemeSelectorMain />
    </div>
  );
}
