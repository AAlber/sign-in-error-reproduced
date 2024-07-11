import { Trash } from "lucide-react";
import { ContextMenuItem } from "@/src/components/reusable/shadcn-ui/context-menu";
import type { WorkbenchPage } from "@/src/components/workbench-deprecated/types";
import useWorkbench from "../../../zustand";

export default function WBPageContentMenuDelete({
  page,
}: {
  page: WorkbenchPage;
}) {
  const { removePage, currentPage, setCurrentPage, getIndexOfPage, getPages } =
    useWorkbench();
  return (
    <ContextMenuItem
      disabled={getPages().length === 1}
      onClick={() => {
        if (currentPage === page.id) {
          const pages = getPages();
          const index = getIndexOfPage(currentPage);
          removePage(page.id);
          setCurrentPage(
            pages[index - 1]?.id ?? pages[index + 1]?.id ?? pages[index]!.id,
          );
        }
        removePage(page.id);
      }}
      className="gap-2"
    >
      <Trash className="h-4 w-4 text-destructive dark:text-red-600" />
      <span className="text-destructive dark:text-red-600">Delete</span>
    </ContextMenuItem>
  );
}
