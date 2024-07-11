import { useTranslation } from "react-i18next";
import classNames from "@/src/client-functions/client-utils";

export default function Title({
  type,
  text,
  className,
}: {
  type: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  text: string;
  className?: string;
}) {
  const { t } = useTranslation("page");

  return (
    <p className={classNames("text-contrast", className)}>
      {type === "h1" && <h1 className="text-3xl font-semibold">{t(text)}</h1>}
      {type === "h2" && <h2 className="text-2xl font-semibold">{t(text)}</h2>}
      {type === "h3" && <h3 className="text-xl font-semibold">{t(text)}</h3>}
      {type === "h4" && <h4 className="text-lg font-medium">{t(text)}</h4>}
      {type === "h5" && <h5 className="text-base font-medium">{t(text)}</h5>}
      {type === "h6" && <h6 className="text-sm font-medium">{t(text)}</h6>}
    </p>
  );
}
