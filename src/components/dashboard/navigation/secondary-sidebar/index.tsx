import { Button } from "@/src/components/reusable/shadcn-ui/button";
import { Input } from "@/src/components/reusable/shadcn-ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/src/components/reusable/shadcn-ui/popover";
import clsx from "clsx";
import { ArrowUpDown, CornerDownLeft, LifeBuoy } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Dimensions } from "../../dimensions";
import { useTabs } from "../../hooks";
import pageHandler from "../../page-handlers/page-handler";
import { useNavigationStateContext } from "../navigation-provider";
import { useNavigation } from "../zustand";

const SecondarySidebar = ({ children }) => {
  const { state, pageFixed, allowExpand } = useNavigationStateContext();
  const { tabs } = useTabs();

  const page = pageHandler.get.currentPage();

  let hideBarOnLessThanTwoElements = false;
  if (page.navigationType === "with-dynamic-secondary-navigation") {
    hideBarOnLessThanTwoElements =
      !!page.options?.hideBarOnLessThanTwoElements && tabs.length < 2;
  }

  const expanded = state === "expanded";
  const shouldExpand = expanded && !hideBarOnLessThanTwoElements;

  return (
    <div
      style={{
        transitionProperty: "width, opacity, border",
        width: shouldExpand ? Dimensions.Navigation.Secondary.ExpandedWidth : 0,
        marginLeft: !pageFixed ? Dimensions.Navigation.Primary.Width - 1 : 0,
        height: !pageFixed ? `calc(100%)` : "",
      }}
      className={clsx(
        shouldExpand ? "border-r border-border" : "opacity-0",
        !pageFixed && `milkblur absolute z-50`,
        allowExpand ? "delay-300 duration-100" : "delay-0 duration-0",
        "overflow-hidden bg-background ease-in-out dark:bg-accent/10",
      )}
    >
      <div
        style={{ minWidth: Dimensions.Navigation.Secondary.ExpandedWidth }}
        className="flex flex-col items-start justify-start gap-2 overflow-y-scroll"
      >
        {children}
      </div>
    </div>
  );
};
SecondarySidebar.displayName = "SecondarySidebar";

const SearchInput = () => {
  const { search, setSearch } = useNavigation();
  const { t } = useTranslation("page");
  const page = pageHandler.get.currentPage();

  if (page.navigationType === "without-secondary-navigation") return null;
  if (
    page.navigationType === "with-static-secondary-navigation" &&
    page.options?.searchDisabled
  ) {
    return null;
  }

  return (
    <div
      style={{
        height: Dimensions.Navigation.Toolbar.Height,
      }}
      className="relative flex h-10 w-full items-center justify-center border-b border-border px-2"
    >
      <Popover open={search.trim().length > 0}>
        <PopoverTrigger className="relative flex h-10 w-full items-center justify-center px-2">
          <Input
            className="h-10 border !border-border/100 bg-background placeholder:text-muted-contrast dark:bg-accent/10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("general.search")}
          />
          <kbd className="pointer-events-none absolute right-4 hidden h-5 select-none items-center gap-1 rounded border border-border bg-background px-1.5 font-mono text-[10px] font-medium text-muted-contrast opacity-100 dark:bg-accent/20 sm:flex">
            {/* For windows it should be Ctrl K */}
            <span className="text-xs">⌘</span>K
          </kbd>
        </PopoverTrigger>
        <PopoverContent className="-mt-1 ml-[66px] flex min-h-[200px] w-[400px] flex-col overflow-hidden p-0">
          <div className="flex-1"></div>
          <div className="flex h-8 w-full items-center justify-between bg-accent/50">
            <div className="pl-2 flex items-center gap-2 text-muted-contrast/70 text-xs">
            <div className="flex items-center">
              <ArrowUpDown className="size-3.5 mr-1" /> Select
            </div>
            <div className="flex items-center">
              <CornerDownLeft className="size-3.5 mr-1" /> Open
            </div>
            </div>
            <Button className="text-muted-contrast/70 text-xs font-normal" variant={"link"}>
              <LifeBuoy className="size-3.5 mr-1" /> Need help?
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};
SearchInput.displayName = "SearchInput";

const ConditionalSkeleton = () => {
  const { loading } = useNavigation();
  const page = pageHandler.get.currentPage();

  return (
    <div className="flex flex-col gap-2 px-2">
      {loading &&
        page.navigationType === "with-dynamic-secondary-navigation" &&
        new Array(5)
          .fill(0)
          .map((_, index) => <div key={index}>{page.skeletonComponent}</div>)}
    </div>
  );
};
ConditionalSkeleton.displayName = "ConditionalSkeleton";

const Tabs = () => {
  const page = pageHandler.get.currentPage();
  const { toggleSecondaryNav } = useNavigationStateContext();
  const [loading, search, currentTab, setCurrentTab] = useNavigation(
    (state) => [
      state.loading,
      state.search,
      state.currentTab,
      state.setCurrentTab,
    ],
  );

  const { tabs } = useTabs();

  return (
    <ul
      role="list"
      id="cards"
      className={clsx("grid w-full grid-cols-1 gap-2 overflow-y-scroll px-2")}
    >
      {!loading &&
        tabs.length === 0 &&
        page.navigationType === "with-dynamic-secondary-navigation" &&
        page.noTabsAvailableDisclaimer}
      {!loading &&
        tabs
          .filter(
            (tab) =>
              tab.type === "divider" ||
              search === "" ||
              tab.searchValue.toLowerCase().includes(search.toLowerCase()),
          )
          .map((tab, index) => (
            <button
              disabled={tab.type !== "divider" && tab.disabled === true}
              key={index}
              onClick={() => {
                if (tab.type === "divider") return;
                toggleSecondaryNav();
                setCurrentTab(tab);
              }}
              className={clsx(tab.type === "divider" && "cursor-default")}
            >
              {tab.type === "divider"
                ? tab.component
                : tab.tabComponent(tab.id === currentTab?.id)}
            </button>
          ))}
    </ul>
  );
};
Tabs.displayName = "Tabs";

SecondarySidebar.SearchInput = SearchInput;
SecondarySidebar.ConditionalSkeleton = ConditionalSkeleton;
SecondarySidebar.Tabs = Tabs;

export { SecondarySidebar };
