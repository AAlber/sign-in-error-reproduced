import { cx } from "class-variance-authority";
import { useTranslation } from "react-i18next";
import { verifyContrast } from "@/src/client-functions/client-institution-theme";
import classNames, { capitalize } from "@/src/client-functions/client-utils";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/src/components/reusable/shadcn-ui/hover-card";
import useThemeStore from "./user-menu/theme-switcher/zustand";

type PrimaryNavigationItemProps = {
  hoverTitle?: string;
  icon: JSX.Element | React.ReactNode;
  onClick?: () => void;
  numberIndicator?: number;
  isActive: boolean;
};

export default function PrimaryNavigationItem({
  hoverTitle,
  icon,
  onClick,
  numberIndicator = 0,
  isActive,
}: PrimaryNavigationItemProps) {
  const { t } = useTranslation("page");

  return (
    <HoverCard openDelay={50} closeDelay={50}>
      <HoverCardTrigger className="relative flex w-full items-center justify-center overflow-hidden p-0">
        <PrimaryNavigationItemTrigger
          isActive={isActive}
          hoverTitle={hoverTitle}
          icon={icon}
          onClick={onClick}
          numberIndicator={numberIndicator}
        />
      </HoverCardTrigger>
      {hoverTitle && (
        <HoverCardContent side="right" className="z-[999]">
          {capitalize(t(hoverTitle))}
        </HoverCardContent>
      )}
    </HoverCard>
  );
}

const PrimaryNavigationItemTrigger = ({
  hoverTitle,
  icon,
  onClick,
  numberIndicator = 0,
  isActive,
}) => {
  const { instiTheme } = useThemeStore();

  return (
    <div
      onClick={onClick}
      key={hoverTitle}
      className={classNames(
        "flex h-12 w-full cursor-pointer items-center justify-center gap-2 overflow-hidden whitespace-nowrap border border-transparent py-0 text-sm transition-all duration-200 ease-in-out hover:bg-background",
        isActive && "bg-background dark:bg-accent/30",
      )}
    >
      {isActive && (
        <div className="calc(100% - 8px) absolute bottom-1 left-[2px] top-1 w-[3px] rounded-full bg-primary" />
      )}
      <span
        className={classNames(
          numberIndicator > 0 || isActive ? "text-primary" : "text-contrast",
        )}
      >
        {icon}
      </span>
      {numberIndicator > 0 && (
        <span
          className={cx(
            numberIndicator < 10
              ? "right-0.5 aspect-square"
              : "-right-0.5 px-1",
            "absolute top-0.5 flex h-3.5 items-center justify-center rounded-full bg-primary text-[10px]",
            verifyContrast(instiTheme) ? "text-background" : "text-white",
          )}
        >
          {numberIndicator}
        </span>
      )}
    </div>
  );
};
