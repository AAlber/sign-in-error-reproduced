import { BubbleMenu as TiptapBubbleMenu } from "@tiptap/react";
import { ArrowDownToLine, ArrowUpToLine, Trash } from "lucide-react";
import React, { memo, useCallback } from "react";
import { useTranslation } from "react-i18next";
import SelectionMenu from "../../selection-menu";
import type { MenuProps, ShouldShowProps } from "../types";
import { isRowGripSelected } from "./utils";

export const TableRowMenu = memo(
  ({ editor, tippyOptions }: MenuProps): JSX.Element => {
    const { t } = useTranslation("page");
    const shouldShow = useCallback(
      ({ view, state, from }: ShouldShowProps) => {
        if (!state || !from) {
          return false;
        }

        return isRowGripSelected({ editor, view, state, from });
      },
      [editor],
    );

    const onAddRowBefore = useCallback(() => {
      editor.chain().focus().addRowBefore().run();
    }, [editor]);

    const onAddRowAfter = useCallback(() => {
      editor.chain().focus().addRowAfter().run();
    }, [editor]);

    const onDeleteRow = useCallback(() => {
      editor.chain().focus().deleteRow().run();
    }, [editor]);

    return (
      <TiptapBubbleMenu
        editor={editor}
        pluginKey="tableRowMenu"
        updateDelay={0}
        tippyOptions={{
          placement: "left",
          popperOptions: {
            modifiers: [{ name: "flip", enabled: false }],
          },
          ...tippyOptions,
        }}
        shouldShow={shouldShow}
      >
        <SelectionMenu.Menu>
          <SelectionMenu.DropdownItem onClick={onAddRowBefore}>
            <ArrowUpToLine className="h-4 w-4" />
            {t("editor.table-row-menu-add-above")}
          </SelectionMenu.DropdownItem>
          <SelectionMenu.DropdownItem onClick={onAddRowAfter}>
            <ArrowDownToLine className="h-4 w-4" />
            {t("editor.table-row-menu-add-below")}
          </SelectionMenu.DropdownItem>
          <SelectionMenu.DropdownItem onClick={onDeleteRow}>
            <Trash className="h-4 w-4" />
            {t("editor.table-row-menu-delete")}
          </SelectionMenu.DropdownItem>
        </SelectionMenu.Menu>
      </TiptapBubbleMenu>
    );
  },
);

TableRowMenu.displayName = "TableRowMenu";
