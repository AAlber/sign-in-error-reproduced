import clsx from "clsx";
import { Menu } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "../shadcn-ui/popover";
import type { resizablePopover } from ".";
import { findTabIndex, handleSelectTab } from "./functions";
import type { FilteredTabs } from "./hooks/use-responsive-tabs";
import type { NavigationTab } from "./hooks/use-tabs";

interface ExcludedTabsPopoverProps {
  tabs: FilteredTabs;
  allTabs: NavigationTab[];
  setSelectedTab: (input: [number, number]) => void;
  selectedTabIndex: number;
  resizablePopover: resizablePopover;
}

export const ExcludedTabsPopover: React.FC<ExcludedTabsPopoverProps> = ({
  tabs,
  allTabs,
  setSelectedTab,
  selectedTabIndex,
  resizablePopover,
}) => {
  if (!tabs.length) return null;

  return (
    <Popover>
      <PopoverTrigger asChild>
        {resizablePopover.trigger ? (
          resizablePopover.trigger
        ) : (
          <div
            className={clsx(
              resizablePopover.className,
              "w-auto cursor-pointer text-contrast transition-all duration-100 ease-in-out hover:text-muted-contrast",
            )}
          >
            <Menu size={16} />
          </div>
        )}
      </PopoverTrigger>
      <PopoverContent className="w-auto bg-background p-2">
        <div className="flex flex-col">
          {tabs.map((item, index) => (
            <button
              key={index}
              className={clsx(
                "text-md relative z-20 flex h-8 cursor-pointer select-none items-center rounded-md bg-transparent px-3 text-sm text-muted-contrast transition-colors hover:text-contrast",
                selectedTabIndex === findTabIndex(allTabs, item.tab) &&
                  "!text-contrast",
              )}
              onClick={() =>
                handleSelectTab(
                  findTabIndex(allTabs, item.tab),
                  allTabs,
                  setSelectedTab,
                  selectedTabIndex,
                )
              }
            >
              {item.tab.tab.name}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};
