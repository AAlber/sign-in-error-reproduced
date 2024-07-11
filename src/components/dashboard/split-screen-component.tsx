import classNames from "@/src/client-functions/client-utils";
import {
  ResizableHandle,
  ResizablePanel,
} from "../reusable/shadcn-ui/resizable";
import { useTabs } from "./hooks";
import { useNavigation } from "./navigation/zustand";
import pageHandler from "./page-handlers/page-handler";

export default function SplitScreenComponent() {
  const pageKey = useNavigation((state) => state.page);
  const page = pageHandler.get.page(pageKey);

  const { currentTab, loading } = useNavigation();
  const { tabs } = useTabs();

  const shouldNotRender =
    !currentTab || loading || tabs.length === 0 || !page.splitScreenComponent;

  return (
    <>
      <ResizableHandle
        withHandle
        className={classNames(shouldNotRender && "hidden", "bg-transparent")}
      />
      <ResizablePanel
        minSize={20}
        maxSize={50}
        defaultSize={20}
        className={classNames(shouldNotRender && "hidden", "relative")}
      >
        <div className="absolute -left-4 h-full w-4 shadow-lg"></div>
        {page.splitScreenComponent}
      </ResizablePanel>
    </>
  );
}
