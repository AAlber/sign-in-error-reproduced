import { useEffect, useState } from "react";
import usePageWidth from "./use-page-width";
import type { NavigationTab } from "./use-tabs";

export type FilteredTabs = {
  tab: NavigationTab;
  index: number;
}[];

const useResponsiveTabsFilter = (tabs: NavigationTab[]) => {
  const pageWidth = usePageWidth();
  const [filteredTabs, setFilteredTabs] = useState<FilteredTabs>([]);
  const [excludedTabs, setExcludedTabs] = useState<FilteredTabs>([]);

  useEffect(() => {
    const filtered = tabs
      .map((tab, index) => ({ tab, index }))
      .filter(
        ({ tab }) =>
          tab.tab.visibleOn?.some(
            (range) => pageWidth >= range.min && pageWidth <= range.max,
          ) ?? true,
      );

    const excluded = tabs
      .map((tab, index) => ({ tab, index }))
      .filter(
        ({ tab }) =>
          !tab.tab.visibleOn?.some(
            (range) => pageWidth >= range.min && pageWidth <= range.max,
          ) ?? false,
      );

    setFilteredTabs(filtered);
    setExcludedTabs(excluded);
  }, [tabs, pageWidth]);

  return { filteredTabs, excludedTabs };
};

export default useResponsiveTabsFilter;
