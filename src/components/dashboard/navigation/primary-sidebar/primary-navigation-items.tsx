import { track } from "@vercel/analytics";
import { PartyPopper } from "lucide-react";
import React from "react";
import useChat from "@/src/components/reusable/page-layout/navigator/chat/zustand";
import { log } from "@/src/utils/logger/logger";
import useUser from "@/src/zustand/user";
import pageHandler from "../../page-handlers/page-handler";
import { useNavigationStateContext } from "../navigation-provider";
import { useNavigation } from "../zustand";
import { ItemsSection } from "./items-section";
import PrimaryNavigationItem from "./primary-navigation-item";

export default function Pages() {
  const user = useUser((state) => state.user);
  const unreadChannels = useChat((state) => state.unreadChannels);
  const { toggleSecondaryNav } = useNavigationStateContext();

  const [setPage, pageKey, tabs] = useNavigation((state) => [
    state.setPage,
    state.page,
    state.tabs,
  ]);

  function handlePageClick(page) {
    if (tabs.length > 0) toggleSecondaryNav();
    if (pageKey === page.titleKey) return;
    setPage(page.titleKey);
    pageHandler.set.page(page.titleKey);
    log.info("Page changed to " + page.titleKey);
    track("Page Visited", { page: page.titleKey });
  }

  const pages = pageHandler.get.availablePages();

  return (
    <ItemsSection>
      {!user.currentInstitutionId && (
        <PrimaryNavigationItem
          key={"welcome"}
          hoverTitle={"welcome"}
          icon={<PartyPopper size={18} />}
          isActive
          onClick={() => console.log("Welcome")}
        />
      )}
      {user.currentInstitutionId &&
        pages
          .filter((page) => {
            if (
              page.titleKey === "CHAT" &&
              !user.institution?.institutionSettings.communication_messaging
            ) {
              return false;
            }
            if (!page.accessRoles) return true;
            if (!user.institution) return false;
            if (!user.institution.highestRole) return false;
            if (page.accessRoles.includes(user.institution.highestRole))
              return true;
          })
          .map((page) => {
            return (
              <React.Fragment key={page.titleKey}>
                <PrimaryNavigationItem
                  key={page.titleKey}
                  hoverTitle={page.titleKey}
                  icon={page.iconComponent}
                  isActive={pageKey === page.titleKey}
                  {...(page.titleKey === "CHAT"
                    ? { numberIndicator: unreadChannels }
                    : {})}
                  onClick={() => handlePageClick(page)}
                />
              </React.Fragment>
            );
          })}
    </ItemsSection>
  );
}
