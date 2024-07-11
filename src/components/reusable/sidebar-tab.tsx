import { useTranslation } from "react-i18next";
import classNames from "@/src/client-functions/client-utils";
import BetaBadge from "./badges/beta";

export default function SidebarTab({
  icon,
  name,
  onClick,
  active,
  subTab,
  beta,
}: {
  icon: JSX.Element;
  name: string;
  onClick: () => void;
  active: boolean;
  subTab?: boolean;
  beta?: boolean;
}) {
  const { t } = useTranslation("page");
  return (
    <button
      key={name}
      onClick={onClick}
      className={classNames(
        active
          ? subTab
            ? "bg-primary/10 text-primary"
            : "bg-primary/30 text-primary"
          : "justify-start border-transparent text-muted-contrast hover:bg-accent/50",
        "flex w-full items-center gap-2 whitespace-nowrap rounded-md px-2 py-2 text-sm transition-all duration-200 ease-in-out",
      )}
    >
      <span>{icon}</span>
      <div className="flex items-center gap-2 text-contrast">
        {t(name)}
        {beta && <BetaBadge />}
      </div>
    </button>
  );
}
