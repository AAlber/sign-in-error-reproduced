import { log } from "@/src/utils/logger/logger";
import type { NavigationTab } from "./hooks/use-tabs";

export const handleSelectTab = (
  index: number,
  tabs: NavigationTab[],
  setSelectedTab: (input: [number, number]) => void,
  selectedTabIndex: number,
) => {
  console.log(index, selectedTabIndex);
  if (tabs[index]) {
    log.click("Navigation tabl clicked", tabs[index]!.tab.id);
    setSelectedTab([index, index > selectedTabIndex ? 1 : -1]);
    if (tabs[index]!.onTabChange) {
      tabs[index]!.onTabChange!();
    }
  }
};

export const findTabIndex = (tabs: NavigationTab[], item: NavigationTab) => {
  return tabs.findIndex((tab) => tab.tab.id === item.tab.id);
};
