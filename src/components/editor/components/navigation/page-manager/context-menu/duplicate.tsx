import { Copy } from "lucide-react";
import { useTranslation } from "react-i18next";
import { ContextMenuItem } from "@/src/components/reusable/shadcn-ui/context-menu";
import type { EditorPage } from "../../../../types";
import { useEditor } from "../../../../zustand";

export default function PageDuplicate({ page }: { page: EditorPage }) {
  const { insertPage, currentPageId, getIndexOfPage } = useEditor();
  const { t } = useTranslation("page");

  return (
    <ContextMenuItem
      onClick={() =>
        insertPage(getIndexOfPage(currentPageId) + 1, page.content)
      }
      className="gap-2"
    >
      <Copy className="h-4 w-4" />
      {t("duplicate")}
    </ContextMenuItem>
  );
}
