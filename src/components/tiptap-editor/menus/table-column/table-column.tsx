import { BubbleMenu as TiptapBubbleMenu } from "@tiptap/react";
import { ArrowLeftToLine, ArrowRightToLine, Trash } from "lucide-react";
import React, { memo, useCallback } from "react";
import { useTranslation } from "react-i18next";
import SelectionMenu from "../../selection-menu";
import type { MenuProps, ShouldShowProps } from "../types";
import { isColumnGripSelected } from "./utils";

export const TableColumnMenu = memo(
  ({ editor, tippyOptions }: MenuProps): JSX.Element => {
    const { t } = useTranslation("page");

    const shouldShow = useCallback(
      ({ view, state, from }: ShouldShowProps) => {
        if (!state) {
          return false;
        }

        return isColumnGripSelected({ editor, view, state, from: from || 0 });
      },
      [editor],
    );

    const onAddColumnBefore = useCallback(() => {
      editor.chain().focus().addColumnBefore().run();
    }, [editor]);

    const onAddColumnAfter = useCallback(() => {
      editor.chain().focus().addColumnAfter().run();
    }, [editor]);

    const onDeleteColumn = useCallback(() => {
      editor.chain().focus().deleteColumn().run();
    }, [editor]);

    return (
      <TiptapBubbleMenu
        editor={editor}
        pluginKey="tableColumnMenu"
        updateDelay={0}
        tippyOptions={{
          placement: "top",
          popperOptions: {
            modifiers: [{ name: "flip", enabled: true }],
          },
          ...tippyOptions,
        }}
        shouldShow={shouldShow}
      >
        <SelectionMenu.Menu>
          <SelectionMenu.DropdownItem onClick={onAddColumnBefore}>
            <ArrowLeftToLine className="h-4 w-4" />
            {t("editor.table-column-menu-add-before")}
          </SelectionMenu.DropdownItem>
          <SelectionMenu.DropdownItem onClick={onAddColumnAfter}>
            <ArrowRightToLine className="h-4 w-4" />
            {t("editor.table-column-menu-add-after")}
          </SelectionMenu.DropdownItem>
          <SelectionMenu.DropdownItem onClick={onDeleteColumn}>
            <Trash className="h-4 w-4" />
            {t("editor.table-column-menu-delete")}
          </SelectionMenu.DropdownItem>
        </SelectionMenu.Menu>
      </TiptapBubbleMenu>
    );
  },
);

TableColumnMenu.displayName = "TableColumnMenu";
