import React from "react";
import { Content } from "./navigation/content";
import { useNavigationStateContext } from "./navigation/navigation-provider";
import { PrimarySidebar } from "./navigation/primary-sidebar";
import { SecondarySidebar } from "./navigation/secondary-sidebar";
import { Toolbar } from "./navigation/toolbar";

const Dashboard = ({ children }) => {
  const dashboardHeight = `calc(100%)`;
  return (
    <div style={{ height: dashboardHeight }} className="flex bg-foreground">
      {children}
    </div>
  );
};

const Navigation = ({ children }) => {
  const {
    state: _state,
    toggleSecondaryNav: _t,
    allowExpand: _allowExpand,
    pageFixed: _pageFixed,
    ...hoverBindings
  } = useNavigationStateContext();
  return (
    <div {...hoverBindings} className="flex">
      {children}
    </div>
  );
};

const ContentWithNavigation = ({ children }) => {
  return <div className="flex-1 overflow-hidden">{children}</div>;
};

Navigation.Primary = PrimarySidebar;
Navigation.Secondary = SecondarySidebar;

Dashboard.Navigation = Navigation;
Dashboard.Content = Content;
Dashboard.Toolbar = Toolbar;
Dashboard.ContentWithNavigation = ContentWithNavigation;

export { Dashboard };
