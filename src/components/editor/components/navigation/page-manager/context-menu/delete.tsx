import { Trash } from "lucide-react";
import { useTranslation } from "react-i18next";
import { ContextMenuItem } from "@/src/components/reusable/shadcn-ui/context-menu";
import type { EditorPage } from "../../../../types";
import { useEditor } from "../../../../zustand";

export default function PageDelete({ page }: { page: EditorPage }) {
  const { t } = useTranslation("page");
  const {
    removePage,
    currentPageId,
    setCurrentPageId: setCurrentPage,
    getIndexOfPage,
    getPages,
  } = useEditor();

  return (
    <ContextMenuItem
      disabled={getPages().length === 1}
      onClick={() => {
        if (currentPageId === page.id) {
          const pages = getPages();
          const index = getIndexOfPage(currentPageId);
          removePage(page.id);
          setCurrentPage(
            pages[index - 1]?.id ?? pages[index + 1]?.id ?? pages[index]!.id,
          );
        }
        removePage(page.id);
      }}
      className="gap-2"
    >
      <Trash className="h-4 w-4 text-destructive dark:text-destructive" />
      <span className="text-destructive dark:text-destructive">
        {t("general.delete")}
      </span>
    </ContextMenuItem>
  );
}
