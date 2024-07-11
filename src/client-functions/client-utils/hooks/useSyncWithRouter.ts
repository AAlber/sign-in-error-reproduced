import { useRouter } from "next/router";
import { useEffect } from "react";
import { useNavigation } from "@/src/components/dashboard/navigation/zustand";
import pageHandler from "@/src/components/dashboard/page-handlers/page-handler";
import useUser from "@/src/zustand/user";
import { handlePageRouting } from "../page-routing-hook";

export function useSyncWithRouter() {
  const [navigateToTab, setPage] = useNavigation((state) => [
    state.navigateToTab,
    state.setPage,
  ]);

  const router = useRouter();
  const user = useUser((state) => state.user);

  // Separate effect for language change to isolate its dependency
  useEffect(() => {
    if (!router.isReady) return;

    handlePageRouting(router, setPage, navigateToTab);
    handleDefaultPageSetting(user, setPage);
  }, [router.isReady, router.query.page, user]);

  function handleDefaultPageSetting(user, setPage) {
    const shouldSetPageToCourses = !user.institution;
    if (shouldSetPageToCourses) pageHandler.set.page("COURSES");
  }
}
