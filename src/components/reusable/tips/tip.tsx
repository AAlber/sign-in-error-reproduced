import { useTranslation } from "react-i18next";

export default function Tip({
  description,
  children,
  title,
}: {
  description: string;
  title?: string;
  children?: React.ReactNode;
}) {
  const { t } = useTranslation("page");

  return (
    <div className="flex flex-col text-start">
      <h3 className="text-base font-semibold">{t(title ?? "tip")}</h3>
      <div className="flex flex-col gap-2">
        <p className="w-full text-sm text-muted-contrast">{t(description)}</p>
        {children}
      </div>
    </div>
  );
}
