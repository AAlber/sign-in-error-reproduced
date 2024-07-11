import { useTranslation } from "react-i18next";

export default function BetaBadge() {
  const { t } = useTranslation("page");

  return (
    <p className="ml-1 flex h-5 items-center rounded-xl border border-border bg-muted/20 px-2 text-xs text-contrast">
      {t("badge_beta")}
    </p>
  );
}
