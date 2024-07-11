import { useTranslation } from "react-i18next";

export default function PopoverTexts() {
  const { t } = useTranslation("page");

  return (
    <div className="flex flex-col">
      <h1 className="font-semibold text-contrast">
        {t("theme_settings_customize")}
      </h1>
      <p className="text-sm text-muted-contrast">
        {t("theme_settings_customize_description")}
      </p>
    </div>
  );
}
