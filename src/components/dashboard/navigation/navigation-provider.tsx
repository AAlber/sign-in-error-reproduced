import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useWindowSize } from "@/src/client-functions/client-utils/hooks";
import { Dimensions } from "../dimensions";
import pageHandler from "../page-handlers/page-handler";
import { useNavigation } from "./zustand";

type NavContext = {
  state: "expanded" | "collapsed";
  pageFixed: boolean;
  allowExpand: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  toggleSecondaryNav: () => void;
};

const NavigationContext = createContext<NavContext | null>(null);

export function NavigationProvider({ children }) {
  const { width } = useWindowSize();
  const isDesktop = width >= Dimensions.Breakpoints.AllowPinnedSidebar;
  const [secondaryPinned, pageKey] = useNavigation((state) => [
    state.secondaryPinned,
    state.page,
  ]);

  const page = pageHandler.get.page(pageKey);
  const pageFixed =
    page.navigationType !== "without-secondary-navigation" &&
    page.options?.fixedSecondaryNavigation;
  const allowExpand =
    page.navigationType === "with-static-secondary-navigation" ||
    (page.navigationType === "with-dynamic-secondary-navigation" && isDesktop);

  const [state, setState] = useState<NavContext["state"]>(
    pageFixed
      ? "expanded"
      : allowExpand && secondaryPinned // initial state on browser refresh
      ? "expanded"
      : "collapsed",
  );

  const hasMountedOnce = useRef<boolean>();

  useEffect(() => {
    if (!hasMountedOnce.current) {
      hasMountedOnce.current = true;
      return;
    }

    if (pageFixed) return setState("expanded");
    setState(allowExpand ? "expanded" : "collapsed");
  }, [page.titleKey, allowExpand]);

  const onMouseEnter = () => {
    if (isDesktop && secondaryPinned) return;
    if (allowExpand) setState("expanded");
  };

  const onMouseLeave = () => {
    if (pageFixed) return;
    if (isDesktop && secondaryPinned) return;
    if (allowExpand) setState("collapsed");
  };

  const toggleSecondaryNav = () => {
    if (pageFixed) return;
    if (isDesktop && secondaryPinned) return;

    state === "expanded" ? setState("collapsed") : setState("expanded");
  };

  return (
    <NavigationContext.Provider
      value={{
        state,
        pageFixed: !!pageFixed,
        allowExpand,
        onMouseEnter,
        onMouseLeave,
        toggleSecondaryNav,
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
}

export const useNavigationStateContext = () => {
  const navCtx = useContext(NavigationContext);
  if (!navCtx)
    throw new Error(
      "Must be used within Dashboard Navigation Context Provider",
    );

  return navCtx;
};
