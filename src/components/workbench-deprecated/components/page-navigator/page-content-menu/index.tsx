import {
  ContextMenuContent,
  ContextMenuSeparator,
} from "@/src/components/reusable/shadcn-ui/context-menu";
import type { WorkbenchPage } from "@/src/components/workbench-deprecated/types";
import WBPageContentMenuDuplicate from "./wb-content-menu-duplicate";
import WBPageContentMenuMove from "./wb-content-menu-move";
import WBPageContentMenuNewPage from "./wb-content-menu-new-page";
import WBPageContentMenuDelete from "./wb-context-menu-delete";

export default function WBPageContentMenu({
  page,
  index,
}: {
  page: WorkbenchPage;
  index: number;
}) {
  return (
    <ContextMenuContent>
      <WBPageContentMenuNewPage page={page} index={index} />
      <WBPageContentMenuMove page={page} />
      <WBPageContentMenuDuplicate page={page} />
      <ContextMenuSeparator />
      <WBPageContentMenuDelete page={page} />
    </ContextMenuContent>
  );
}
