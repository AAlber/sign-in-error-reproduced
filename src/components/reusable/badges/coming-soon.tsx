import { useTranslation } from "react-i18next";

export default function ComingSoonBadge() {
  const { t } = useTranslation("page");

  return (
    <p className="ml-1 flex items-center rounded-xl border border-yellow-300 bg-yellow-100 px-1.5 text-xs text-yellow-800 dark:border-yellow-600 dark:bg-yellow-900 dark:text-yellow-100">
      {t("badge_coming_soon")}
    </p>
  );
}
