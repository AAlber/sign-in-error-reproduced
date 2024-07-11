import { useTranslation } from "react-i18next";

export default function Separator({ title }) {
  const { t } = useTranslation("page");

  return (
    <div className="mb-2 mt-5 flex w-full select-none items-center justify-start text-sm text-contrast">
      {t(title)}
    </div>
  );
}
