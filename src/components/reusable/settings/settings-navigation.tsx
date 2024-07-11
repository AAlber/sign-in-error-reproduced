import {
  NavigationMenu,
  NavigationMenuList,
} from "../shadcn-ui/navigation-menu";
import { SettingsSearch } from "./settings-search";
import SettingsTabButton from "./settings-tab-button";
import SettingsTabMenu from "./settings-tab-menu";

export default function SettingsNavigation(props: SettingsPageProps) {
  return (
    <div className="relative border-b border-border pb-1.5">
      <NavigationMenu>
        <NavigationMenuList className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:flex">
          {props.tabs.map((tab) => {
            if (tab.type === "menu")
              return (
                <SettingsTabMenu
                  key={tab.name}
                  {...tab}
                  setActiveTab={props.setActiveTab}
                />
              );
            else
              return (
                <SettingsTabButton
                  key={tab.name}
                  {...tab}
                  setActiveTab={props.setActiveTab}
                />
              );
          })}
        </NavigationMenuList>
      </NavigationMenu>
      <div className="absolute right-2 top-1 hidden w-[300px] xl:flex">
        <SettingsSearch tabs={props.tabs} setActiveTab={props.setActiveTab} />
      </div>
    </div>
  );
}
