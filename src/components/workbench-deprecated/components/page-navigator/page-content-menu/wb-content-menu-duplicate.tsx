import cuid from "cuid";
import { Copy } from "lucide-react";
import { ContextMenuItem } from "@/src/components/reusable/shadcn-ui/context-menu";
import type { WorkbenchPage } from "@/src/components/workbench-deprecated/types";
import useWorkbench from "../../../zustand";

export default function WBPageContentMenuDuplicate({
  page,
}: {
  page: WorkbenchPage;
}) {
  const { insertPage, currentPage, getIndexOfPage } = useWorkbench();
  return (
    <ContextMenuItem
      onClick={() =>
        insertPage(
          {
            ...page,
            id: cuid(),
          },
          getIndexOfPage(currentPage) + 1,
        )
      }
      className="gap-2"
    >
      <Copy className="h-4 w-4" />
      Duplicate
    </ContextMenuItem>
  );
}
