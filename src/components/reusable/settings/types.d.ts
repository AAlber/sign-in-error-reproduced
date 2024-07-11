interface SettingsTabBase {
  id: number;
  name: string;
  icon: JSX.Element;
}

interface SettingsTabButton extends SettingsTabBase {
  type: "button";
  comingSoon?: boolean;
}

interface SettingsTabMenu extends SettingsTabBase {
  type: "menu";
  tabs: SettingsMenuItem[];
}

interface SettingsMenuItem {
  id: number;
  name: string;
  icon: JSX.Element;
}

type SettingsTab = SettingsTabButton | SettingsTabMenu;

interface SettingsTabContentProps {
  children: React.ReactNode;
}

interface SettingsPageProps {
  tabs: SettingsTab[];
  includeSearch: boolean;
  activeTab: number;
  loading?: boolean;
  showNavbar: boolean;
  setActiveTab: (id: number) => void;
  children: React.ReactNode;
}

interface SettingsSearchProps {
  tabs: SettingsTab[];
  setActiveTab: (id: number) => void;
}
