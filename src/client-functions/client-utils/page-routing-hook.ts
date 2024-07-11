import pageHandler from "@/src/components/dashboard/page-handlers/page-handler";
import { useLearnDialog } from "@/src/components/reusable/learn/zustand";
import { log } from "@/src/utils/logger/logger";
import useUser from "@/src/zustand/user";
import { delay, removeQueryParam } from "./index";

export async function handlePageRouting(router, setPage, navigateToTab) {
  const page = router.query.page;
  const tab = router.query.tab;
  const action = router.query.actions;

  const isValidPage =
    typeof page === "string" &&
    pageHandler.get
      .availablePages()
      .map((p) => p.titleKey)
      .includes(page as PageKey);

  console.log("tab", tab);
  if (isValidPage) {
    setPage(page);
    if (tab) navigateToTab(tab);
  }
  if (action) handleRouterActions(action);
  await delay(100);
  removeQueryParam(router, ["page", "tab", "actions"]);
}

type Actions = "open:welcome-learn-menu";

export function handleRouterActions(actions: Actions) {
  const actionList = actions.split(",");
  const { user, refreshUser } = useUser.getState();
  const { openMenu } = useLearnDialog.getState();
  log.info("Trigger router action" + actionList);

  actionList.forEach((action) => {
    switch (action.trim().split(":")[0]) {
      case "open":
        log.info("Opening menu", { action });
        const [, menu] = action.split(":");
        if (!menu) {
          log.warn("No menu provided for open action", { action });
          return;
        }
        if (menu === "welcome-learn-menu") {
          openMenu(
            "welcome-learn-menu",
            user.institution?.hasAdminRole
              ? "learn_menu.welcome.admin.structure.url"
              : "learn_menu.welcome.student.courses.url",
          );
        } else {
          log.warn("Unknown menu", { menu });
        }
        break;
      case "test":
        alert("Testing...");
        break;
      case "refresh-user": {
        log.info("Running action", { action });
        refreshUser();
      }
      default:
        log.warn("Unknown action", { action });
        break;
    }
  });
}
