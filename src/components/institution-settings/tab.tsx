import clsx from "clsx";
import { useTranslation } from "react-i18next";
import { SeparatorWithTitle } from "../reusable/separator-with-title";
import { useInstitutionSettings } from "./zustand";

type Props =
  | {
      type: "tab";
      tab: { name: string; icon: JSX.Element };
      isActive: boolean;
    }
  | {
      type: "divider";
      tab: { name: string; icon: JSX.Element };
    };

export default function InstitutionSettingsTab(props: Props) {
  const { t } = useTranslation("page");
  const { setMenuContent } = useInstitutionSettings();

  if (props.type === "divider") {
    return <SeparatorWithTitle title={props.tab.name} />;
  }

  return (
    <div
      className={clsx(
        props.isActive && "bg-accent/50 text-sm font-medium",
        "flex cursor-pointer items-center gap-2 rounded-md p-1.5 text-sm hover:bg-accent/50",
      )}
      onClick={() => {
        setTimeout(() => {
          setMenuContent(undefined); // the actual onClick on the tab will also fire along with this
        }, 100); // add a timeout to avoid flicker
      }}
    >
      <div className="text-muted-contrast">{props.tab.icon}</div>
      {t(props.tab.name)}
    </div>
  );
}
