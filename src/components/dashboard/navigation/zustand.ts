import { persist } from "zustand/middleware";
import { shallow } from "zustand/shallow";
import { createWithEqualityFn } from "zustand/traditional";

interface SidebarStoreState {
  refreshTrigger: number;
  search: string;
  setSearch: (search: string) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  navigationHovered: boolean;
  setNavigationHovered: (navigationHovered: boolean) => void;
  secondaryPinned: boolean;
  setSecondaryPinned: (secondaryPinned: boolean) => void;
  tabs: SecondaryNavigationElement[];
  setTabs: (tabs: SecondaryNavigationElement[]) => void;
  currentTab: SecondaryNavigationElement | null;
  tabToNavigateTo: SecondaryNavigationElement["id"] | null;
  navigateToTab: (tabToMoveTo: SecondaryNavigationElement["id"] | null) => void;
  page: Page["titleKey"];
  setPage: (data: Page["titleKey"]) => void;
  setCurrentTab: (currentTab: SecondaryNavigationElement | null) => void;
  refresh: () => void;
}

const useNavigation = createWithEqualityFn<SidebarStoreState>()(
  persist(
    (set, get) => ({
      refreshTrigger: 0,
      search: "",
      setSearch: (search) => set({ search }),
      navigationHovered: false,
      setNavigationHovered: (navigationHovered) => set({ navigationHovered }),
      secondaryPinned: false,
      setSecondaryPinned: (secondaryPinned) => set({ secondaryPinned }),
      loading: false,
      setLoading: (loading) => set({ loading }),
      tabs: [],
      setTabs: (tabs) => set({ tabs }),
      tabToNavigateTo: null,
      navigateToTab: (tabToNavigatorTo) =>
        set({
          tabToNavigateTo: tabToNavigatorTo,
          refreshTrigger: get().refreshTrigger + 1,
        }),
      page: "COURSES" as Page["titleKey"],
      setPage: (page) => set({ page }),
      currentTab: null,
      setCurrentTab: (currentTab) =>
        set({
          currentTab,
          tabToNavigateTo: currentTab ? currentTab.id : null,
        }),
      refresh: () => set({ refreshTrigger: get().refreshTrigger + 1 }),
    }),
    {
      name: "navigation-store",
      version: 1,
      partialize: (state) => ({
        tabToNavigateTo: state.tabToNavigateTo,
        page: state.page,
        secondaryPinned: state.secondaryPinned,
        currentTab: state.currentTab?.id,
      }),
    },
  ),
  shallow,
);

export { useNavigation };
