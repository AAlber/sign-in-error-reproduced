import { Dimensions } from "../../dimensions";
import pageHandler from "../../page-handlers/page-handler";
import { useNavigation } from "../zustand";

const Toolbar = () => {
  const { currentTab } = useNavigation();

  const page = pageHandler.get.currentPage();

  return (
    <div
      style={{
        height: Dimensions.Navigation.Toolbar.Height,
      }}
      className="flex w-full items-center border-b border-border bg-foreground"
    >
      <div className="flex-1 p-4">
        {page.navigationType === "without-secondary-navigation"
          ? page.toolbarComponent
          : currentTab &&
            currentTab.type !== "divider" &&
            currentTab.toolbarComponent}
      </div>
    </div>
  );
};

export { Toolbar };
