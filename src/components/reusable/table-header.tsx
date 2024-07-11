import { useTranslation } from "react-i18next";
import classNames from "@/src/client-functions/client-utils";

interface TableHeaderElementProps {
  text: string;
  onClick: () => void;
  className?: string;
}

export default function TableHeaderElement({
  text,
  onClick,
  className,
}: TableHeaderElementProps) {
  const { t } = useTranslation("page");

  return (
    <div onClick={onClick} className={classNames(className, "text-contrast")}>
      {t(text)}
    </div>
  );
}
