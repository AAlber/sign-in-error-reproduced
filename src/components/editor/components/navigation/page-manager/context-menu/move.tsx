import { ArrowUpDown, ChevronFirst, ChevronLast } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  ContextMenuItem,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
} from "@/src/components/reusable/shadcn-ui/context-menu";
import type { EditorPage } from "../../../../types";
import { useEditor } from "../../../../zustand";

export default function PageMove({ page }: { page: EditorPage }) {
  const { getPages, insertPage, removePage, setCurrentPageId } = useEditor();
  const { t } = useTranslation("page");

  return (
    <ContextMenuSub>
      <ContextMenuSubTrigger className="gap-2">
        <ArrowUpDown className="h-4 w-4" />
        {t("move")}
      </ContextMenuSubTrigger>
      <ContextMenuSubContent className="w-48">
        <ContextMenuItem
          onClick={() => {
            removePage(page.id);
            insertPage(0, page.content);
            setCurrentPageId(getPages()[0]!.id);
          }}
          className="gap-2"
        >
          <ChevronFirst className="h-4 w-4 rotate-90" />
          {t("move_to_top")}
        </ContextMenuItem>
        <ContextMenuItem
          onClick={() => {
            removePage(page.id);
            insertPage(getPages().length, page.content);
            setCurrentPageId(getPages()[getPages().length - 1]!.id);
          }}
          className="gap-2"
        >
          <ChevronLast className="h-4 w-4 rotate-90" />
          {t("move_to_bottom")}
        </ContextMenuItem>
      </ContextMenuSubContent>
    </ContextMenuSub>
  );
}
