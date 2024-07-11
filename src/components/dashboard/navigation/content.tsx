import useUser from "@/src/zustand/user";
import NoOrganization from "../../administration/no-organization";
import Skeleton from "../../skeleton";
import pageHandler from "../page-handlers/page-handler";
import { useNavigation } from "./zustand";

const Content = () => {
  const { currentTab, loading } = useNavigation();
  const page = pageHandler.get.currentPage();
  const { user } = useUser();

  return (
    <div className="flex-1 size-full overflow-hidden bg-foreground">
      {loading && <Skeleton />}
      {!loading && !user?.currentInstitutionId && <NoOrganization />}
      {!loading && page.navigationType === "without-secondary-navigation"
        ? page.contentComponent
        : currentTab &&
          currentTab.type !== "divider" && <>{currentTab.contentComponent}</>}
      {!loading &&
        page.navigationType === "with-dynamic-secondary-navigation" &&
        !currentTab &&
        page.noTabSelectedDisclaimer}
    </div>
  );
};

export { Content };
