import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { log } from "@/src/utils/logger/logger";
import useUser from "@/src/zustand/user";
import NavigationTabs from "../../navigation-tabs";
import { CardDescription, CardHeader, CardTitle } from "../../shadcn-ui/card";
import { createTabsList } from "./list";

export const UserOverviewContent = () => {
  const { t } = useTranslation("page");
  const userInstitution = useUser((state) => state.user.institution);

  const tabsList = useMemo(() => {
    return createTabsList();
  }, [userInstitution]);

  return (
    <div className="flex size-full overflow-y-auto">
      <NavigationTabs
        tabs={tabsList.map((tab) => ({
          tab: {
            name: t(tab.name),
            id: tab.id,
            children: (
              <div>
                <CardHeader className="px-0 pb-4 pt-2">
                  <CardTitle className="text-lg">{t(tab.name)}</CardTitle>
                  <CardDescription>{t(tab.description)}</CardDescription>
                </CardHeader>
                {tab.component}
              </div>
            ),
            visibleOn: tab.visibleOn,
          },
          onTabChange: () => {
            log.info(`Switched tab in user overview modal to: ${t(tab.name)}`);
          },
        }))}
        initialTabId={tabsList[0]!.id}
        contentClassName="mt-0 flex h-auto w-full flex-col justify-start gap-4 px-4"
        tabsClassName="mb-4 h-14 w-full justify-start gap-2 rounded-none border-b border-border !bg-foreground p-4 flex items-center"
        resizablePopover={{
          side: "right",
        }}
      />
    </div>
  );
};
