import UserMenu from "@/src/components/dashboard/navigation/primary-sidebar/user-menu";
import { Dimensions } from "../../dimensions";
import Pages from "./primary-navigation-items";
import SupportButtonTrigger from "./support-button/support-trigger";
import { UserServices } from "./user-services";
import InstitutionSwitcher from "../toolbar/institution-switcher";

const PrimarySidebar = ({ children }) => {
  return (
    <div
      style={{ width: Dimensions.Navigation.Primary.Width }}
      className="flex h-full flex-col items-center justify-between bg-accent/50 dark:bg-accent/60"
    >
      {children}
    </div>
  );
};

function PrimarySideBarTop({ children }) {
  return <ul className="flex flex-col items-center">{children}</ul>;
}

function PrimarySidebarBottom({ children }) {
  return (
    <div className="flex flex-col items-center justify-center pb-2">
      {children}
    </div>
  );
}

function InstitutionLogo() {
  return (
    <div
      style={{
        width: Dimensions.Navigation.Primary.Width,
        height: Dimensions.Navigation.Toolbar.Height,
      }}
      className="flex items-center justify-center"
    >
      <InstitutionSwitcher />
    </div>
  );
}

PrimarySidebar.Pages = Pages;
PrimarySidebar.UserServices = UserServices;
PrimarySidebar.Support = SupportButtonTrigger;
PrimarySidebar.UserAccount = UserMenu;
PrimarySidebar.Top = PrimarySideBarTop;
PrimarySidebar.Bottom = PrimarySidebarBottom;
PrimarySidebar.InstitutionLogo = InstitutionLogo
export { PrimarySidebar };

