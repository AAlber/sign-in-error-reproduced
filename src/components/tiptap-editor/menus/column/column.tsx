import { BubbleMenu as TiptapBubbleMenu } from "@tiptap/react";
import { Columns, PanelLeft, PanelRight } from "lucide-react";
import { useCallback } from "react";
import { sticky } from "tippy.js";
import { v4 as uuid } from "uuid";
import { getRenderContainer } from "@/src/client-functions/client-editor";
import { ColumnLayout } from "../../extensions/columns/columns";
import SelectionMenu from "../../selection-menu";
import type { MenuProps } from "../types";

export const ColumnMenu = ({ editor, tippyOptions }: MenuProps) => {
  const getReferenceClientRect = useCallback(() => {
    const renderContainer = getRenderContainer(editor, "columns");
    const rect =
      renderContainer?.getBoundingClientRect() ||
      new DOMRect(-1000, -1000, 0, 0);

    return rect;
  }, [editor]);

  const shouldShow = useCallback(() => {
    const isColumns = editor.isActive("columns");
    return isColumns;
  }, [editor]);

  const onColumnLeft = useCallback(() => {
    editor.chain().focus().setLayout(ColumnLayout.SidebarLeft).run();
  }, [editor]);

  const onColumnRight = useCallback(() => {
    editor.chain().focus().setLayout(ColumnLayout.SidebarRight).run();
  }, [editor]);

  const onColumnTwo = useCallback(() => {
    editor.chain().focus().setLayout(ColumnLayout.TwoColumn).run();
  }, [editor]);

  return (
    <TiptapBubbleMenu
      editor={editor}
      pluginKey={`columnsMenu-${uuid()}`}
      shouldShow={shouldShow}
      updateDelay={0}
      tippyOptions={{
        offset: [0, 8],
        popperOptions: {
          modifiers: [{ name: "flip", enabled: false }],
        },
        getReferenceClientRect,
        plugins: [sticky],
        sticky: "popper",
        ...tippyOptions,
      }}
    >
      <SelectionMenu>
        <SelectionMenu.Section>
          <SelectionMenu.IconButton
            icon={<PanelLeft className="h-4 w-4" />}
            active={editor.isActive("columns", {
              layout: ColumnLayout.SidebarLeft,
            })}
            onClick={onColumnLeft}
          />
          <SelectionMenu.IconButton
            icon={<Columns className="h-4 w-4" />}
            active={editor.isActive("columns", {
              layout: ColumnLayout.TwoColumn,
            })}
            onClick={onColumnTwo}
          />
          <SelectionMenu.IconButton
            icon={<PanelRight className="h-4 w-4" />}
            active={editor.isActive("columns", {
              layout: ColumnLayout.SidebarRight,
            })}
            onClick={onColumnRight}
          />
        </SelectionMenu.Section>
      </SelectionMenu>
    </TiptapBubbleMenu>
  );
};

export default ColumnMenu;
