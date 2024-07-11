import DragHandle from "@tiptap-pro/extension-drag-handle-react";
import {
  Clipboard,
  Copy,
  GripVertical,
  Plus,
  RemoveFormatting,
  Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/src/components/reusable/shadcn-ui/button";
import { DropdownMenuSeparator } from "@/src/components/reusable/shadcn-ui/dropdown-menu";
import SelectionMenu from "../../selection-menu";
import type { MenuProps } from "../types";
import { useContentDragActions } from "./hooks/use-content-drag-actions";
import { useData } from "./hooks/use-data";

export const ContentDragMenu = ({ editor, tippyOptions }: MenuProps) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { t } = useTranslation("page");
  const data = useData();
  const actions = useContentDragActions(
    editor,
    data.currentNode,
    data.currentNodePos,
  );
  useEffect(() => {
    if (menuOpen) {
      editor.commands.setMeta("lockDragHandle", true);
    } else {
      editor.commands.setMeta("lockDragHandle", false);
    }
  }, [editor, menuOpen]);

  return (
    <DragHandle
      pluginKey="ContentItemMenu"
      editor={editor}
      onNodeChange={data.handleNodeChange}
      tippyOptions={{
        offset: [-2, 4],
        zIndex: 99,
        ...tippyOptions,
      }}
    >
      <div className="flex items-center gap-0.5">
        <Button
          variant={"ghost"}
          size={"icon"}
          className="text-muted-contrast hover:text-contrast"
          onClick={actions.handleAdd}
        >
          <Plus className="h-4 w-4" />
        </Button>
        <SelectionMenu.Dropdown open={menuOpen} onOpenChange={setMenuOpen}>
          <SelectionMenu.DropdownTrigger>
            <SelectionMenu.IconButton
              icon={<GripVertical className="h-4 w-4" />}
            />
          </SelectionMenu.DropdownTrigger>
          <SelectionMenu.DropdownContent align="start">
            <SelectionMenu.DropdownClose>
              <SelectionMenu.DropdownItem onClick={actions.resetTextFormatting}>
                <RemoveFormatting className="h-4 w-4" />
                {t("editor.content-menu-clear-formatting")}
              </SelectionMenu.DropdownItem>
            </SelectionMenu.DropdownClose>
            <SelectionMenu.DropdownClose>
              <SelectionMenu.DropdownItem onClick={actions.copyNodeToClipboard}>
                <Clipboard className="h-4 w-4" />
                {t("editor.content-menu-copy")}
              </SelectionMenu.DropdownItem>
            </SelectionMenu.DropdownClose>
            <SelectionMenu.DropdownClose>
              <SelectionMenu.DropdownItem onClick={actions.duplicateNode}>
                <Copy className="h-4 w-4" />
                {t("editor.content-menu-duplicate")}
              </SelectionMenu.DropdownItem>
            </SelectionMenu.DropdownClose>
            <DropdownMenuSeparator className="-my-0" />
            <SelectionMenu.DropdownClose>
              <SelectionMenu.DropdownItem
                onClick={actions.deleteNode}
                className=" text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
                {t("general.delete")}
              </SelectionMenu.DropdownItem>
            </SelectionMenu.DropdownClose>
          </SelectionMenu.DropdownContent>
        </SelectionMenu.Dropdown>
      </div>
    </DragHandle>
  );
};
