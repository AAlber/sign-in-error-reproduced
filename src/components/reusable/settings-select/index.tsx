import { useTranslation } from "react-i18next";

export default function SettingsItemWithDescription({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  const { t } = useTranslation("page");

  return (
    <div className="flex items-center justify-between gap-3 px-2 py-3 text-sm text-contrast">
      <div className="flex flex-col gap-0.5">
        <span>{t(title)} </span>
        {description && (
          <p className="text-xs text-muted-contrast">{t(description)}</p>
        )}
      </div>
      <div className="ml-3 mr-2 flex h-5 items-center justify-start">
        {children}
      </div>
    </div>
  );
}
