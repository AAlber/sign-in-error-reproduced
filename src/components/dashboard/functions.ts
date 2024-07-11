import { useNavigation } from "./navigation/zustand";
import pageHandler from "./page-handlers/page-handler";

export async function loadTabs({
  silentLoad,
}: {
  silentLoad: boolean;
}): Promise<void> {
  const { setState, getState } = useNavigation;
  setState({ loading: !silentLoad, tabs: [] });
  const page = pageHandler.get.currentPage();

  if (page.navigationType === "without-secondary-navigation") {
    return setState({ loading: false });
  }

  if (page.navigationType === "with-static-secondary-navigation") {
    const tabToNavigatorTo = page.secondaryNavigationElements.find(
      (tab) => tab.id === getState().tabToNavigateTo,
    );

    const currentTab = tabToNavigatorTo
      ? tabToNavigatorTo
      : page.secondaryNavigationElements[0];

    return setState({
      tabs: page.secondaryNavigationElements,
      currentTab: currentTab,
      loading: false,
    });
  }

  const tabs: SecondaryNavigationElement[] =
    await pageHandler.get.secondaryNavigationElements();
  const allTabsAreDisabled = tabs.every(
    (tab) => tab.type === "divider" || tab.disabled,
  );

  const tabToNavigatorTo = tabs.find(
    (tab) => tab.id === getState().tabToNavigateTo,
  );
  const pageHasChanged =
    pageHandler.get.currentPage().titleKey !== page.titleKey;

  if (pageHasChanged) return setState({ loading: false });

  setState({
    tabs,
    currentTab: !allTabsAreDisabled
      ? tabToNavigatorTo
        ? tabToNavigatorTo
        : tabs[0] ?? null
      : null,
    loading: false,
  });
}

export async function silentlyRefreshDynamicTabs() {
  const { setState } = useNavigation;
  const page = pageHandler.get.currentPage();

  if (page.navigationType === "without-secondary-navigation") return;
  if (page.navigationType === "with-static-secondary-navigation") return;

  const tabs: SecondaryNavigationElement[] =
    await pageHandler.get.secondaryNavigationElements();

  const pageHasChanged =
    pageHandler.get.currentPage().titleKey !== page.titleKey;

  if (pageHasChanged) return;

  setState({ tabs });
}
