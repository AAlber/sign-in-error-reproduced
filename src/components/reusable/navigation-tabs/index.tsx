import clsx from "clsx";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import type { NavigationTab } from "./hooks/use-tabs";
import { useTabs } from "./hooks/use-tabs";
import { Framer } from "./tabs-framer";

export type resizablePopover = {
  trigger?: React.ReactNode;
  side: "left" | "right";
  className?: string;
};

interface NavigationTabsProps {
  tabs: NavigationTab[];
  initialTabId: string;
  tabsClassName?: string;
  contentClassName?: string;
  resizablePopover: resizablePopover;
}

export default function NavigationTabs({
  tabs,
  initialTabId,
  tabsClassName,
  contentClassName,
  resizablePopover,
}: NavigationTabsProps) {
  const { i18n } = useTranslation(); // Hook to get i18n instance
  const [hookProps, setHookProps] = useState({ tabs, initialTabId });
  const framer = useTabs(hookProps);

  // Effect to update the component when language changes
  useEffect(() => {
    setHookProps({ tabs, initialTabId });
  }, [i18n.language, tabs, initialTabId]);

  return (
    <div className="size-full">
      <div className="size-full">
        <Framer.Tabs
          {...framer.tabProps}
          className={tabsClassName}
          resizablePopover={resizablePopover}
        />
        {framer.selectedTab && (
          <Framer.Content
            {...framer.contentProps}
            className={clsx("size-full", contentClassName)}
          >
            {framer.selectedTab.tab.children}
          </Framer.Content>
        )}
      </div>
    </div>
  );
}
