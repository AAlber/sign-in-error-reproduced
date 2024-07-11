import { useTranslation } from "react-i18next";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../shadcn-ui/popover";
import { TabsTrigger } from "../../shadcn-ui/tabs";
import type { UserOverviewTab } from "./list";

export const UserOverviewTabsPopover = ({
  children,
  tabs,
}: {
  children: React.ReactNode;
  tabs: UserOverviewTab[];
}) => {
  const { t } = useTranslation("page");

  return (
    <Popover>
      <PopoverTrigger className="ml-auto">{children}</PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <div className="flex flex-col items-start gap-2 p-2">
          {tabs.map((tab, index) => (
            <TabsTrigger
              className="w-full justify-start hover:text-muted-contrast"
              key={index}
              value={tab.id}
            >
              {t(tab.name)}
            </TabsTrigger>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};
