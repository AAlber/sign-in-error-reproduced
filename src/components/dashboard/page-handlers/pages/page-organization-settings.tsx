import { Settings2 } from "lucide-react";
import InstitutionSettings from "@/src/components/institution-settings";
import InstiSettingsWithMenuContent from "@/src/components/institution-settings/setting-containers/inst-settings-with-menu/content";
import InstiSettingsWithMenuHeader from "@/src/components/institution-settings/setting-containers/inst-settings-with-menu/header";
import InstitutionSettingsTab from "@/src/components/institution-settings/tab";
import getInstitutionSettingsTabs from "@/src/components/institution-settings/tabs";
import { PageBuilder } from "../page-registry";

const organizationSettings = new PageBuilder("ORGANIZATION_SETTINGS")
  .withIconComponent(<Settings2 size={18} />)
  .withAccessRoles(["admin"])
  .withNavigationType("with-static-secondary-navigation")
  .withSecondaryNavigationElements(
    getInstitutionSettingsTabs()
      .map((tab) => {
        if (tab.type === "menu") {
          return [
            {
              id: tab.id.toString(),
              type: "divider",
              component: <InstitutionSettingsTab type="divider" tab={tab} />,
            } satisfies SecondaryNavigationElement,
            ...(tab.tabs.map(
              (item) =>
                ({
                  id: item.id.toString(),
                  searchValue: item.name,
                  type: "tab",
                  tabComponent: (isActive) => (
                    <InstitutionSettingsTab
                      type="tab"
                      tab={item}
                      isActive={isActive}
                    />
                  ),
                  contentComponent: (
                    <InstiSettingsWithMenuContent tabId={item.id} />
                  ),
                  toolbarComponent: <InstiSettingsWithMenuHeader />,
                }) as SecondaryNavigationElement,
            ) satisfies SecondaryNavigationElement[]),
          ] satisfies SecondaryNavigationElement[];
        } else {
          return {
            id: tab.id.toString(),
            searchValue: tab.name,
            type: "tab",
            tabComponent: (isActive) => (
              <InstitutionSettingsTab
                type="tab"
                tab={tab}
                isActive={isActive}
              />
            ),
            contentComponent: <InstitutionSettings tabId={tab.id} />,
            toolbarComponent: <></>,
          } as SecondaryNavigationElement;
        }
      })
      .flat(),
  )
  .withOptions({ fixedSecondaryNavigation: true })
  .build();

export { organizationSettings };
