import type { ReactNode } from "react";
import { useState } from "react";

type Tab = {
  name: string;
  id: string;
  children: ReactNode;
  visibleOn?: { min: number; max: number }[];
};

export type NavigationTab = {
  tab: Tab;
  onTabChange?: () => void;
};

export function useTabs({
  tabs,
  initialTabId,
  onChange,
}: {
  tabs: NavigationTab[];
  initialTabId: string;
  onChange?: (id: string) => void;
}) {
  const [[selectedTabIndex, direction], setSelectedTab] = useState(() => {
    const indexOfInitialTab = tabs.findIndex(
      (tab) => tab.tab.id === initialTabId,
    );
    return [indexOfInitialTab === -1 ? 0 : indexOfInitialTab, 0];
  });

  return {
    tabProps: {
      tabs,
      selectedTabIndex,
      onChange,
      setSelectedTab,
    },
    selectedTab: tabs[selectedTabIndex],
    contentProps: {
      direction,
      selectedTabIndex,
    },
  };
}
