import {
  ArrowDown,
  ArrowUp,
  ChevronFirst,
  ChevronLast,
  Plus,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
} from "@/src/components/reusable/shadcn-ui/context-menu";
import type { EditorPage } from "../../../../types";
import { useEditor } from "../../../../zustand";

export default function PageNew({
  page,
  index,
}: {
  page: EditorPage;
  index: number;
}) {
  const { getPages, insertNewPage } = useEditor();
  const { t } = useTranslation("page");

  return (
    <ContextMenuSub>
      <ContextMenuSubTrigger className="gap-2">
        {" "}
        <Plus className="h-4 w-4" />
        {t("new_page")}
      </ContextMenuSubTrigger>
      <ContextMenuSubContent className="w-48">
        <ContextMenuItem onClick={() => insertNewPage(index)} className="gap-2">
          <ArrowUp className="h-4 w-4" />
          {t("add_above")}
        </ContextMenuItem>
        <ContextMenuItem
          onClick={() => insertNewPage(index + 1)}
          className="gap-2"
        >
          <ArrowDown className="h-4 w-4" />
          {t("add_below")}
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem onClick={() => insertNewPage(0)} className="gap-2">
          <ChevronFirst className="h-4 w-4 rotate-90" />
          {t("add_to_top")}
        </ContextMenuItem>
        <ContextMenuItem
          onClick={() => insertNewPage(getPages().length)}
          className="gap-2"
        >
          <ChevronLast className="h-4 w-4 rotate-90" />
          {t("add_to_bottom")}
        </ContextMenuItem>
      </ContextMenuSubContent>
    </ContextMenuSub>
  );
}
