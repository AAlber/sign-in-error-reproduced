import type { Editor } from "@tiptap/react";
import { EditorContent } from "@tiptap/react";
import { forwardRef } from "react";
import classNames from "@/src/client-functions/client-utils";
import {
  ColumnMenu,
  ContentDragMenu,
  ImageBlockMenu,
  LinkMenu,
  TableColumnMenu,
  TableRowMenu,
  TextBubbleMenu,
} from "./menus";
import type { TiptapEditorMenus } from "./types";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  editor: Editor;
  menus?: TiptapEditorMenus;
}

export const TiptapEditor = forwardRef<HTMLDivElement, Props>(
  ({ editor, menus, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        {...props}
        className={classNames("flex h-full w-full justify-center", className)}
      >
        <EditorContent editor={editor} className="size-full max-w-[800px]" />
        {(menus?.link?.enabled ?? true) && (
          <LinkMenu editor={editor} tippyOptions={menus?.link?.tippyOptions} />
        )}
        {(menus?.textBubble?.enabled ?? true) && (
          <TextBubbleMenu
            editor={editor}
            tippyOptions={menus?.textBubble?.tippyOptions}
            subMenu={menus?.textBubble?.subMenu}
          />
        )}
        {(menus?.contentDrag?.enabled ?? true) && (
          <ContentDragMenu
            editor={editor}
            tippyOptions={menus?.contentDrag?.tippyOptions}
          />
        )}
        {(menus?.imageBlock?.enabled ?? true) && (
          <ImageBlockMenu
            editor={editor}
            tippyOptions={menus?.imageBlock?.tippyOptions}
          />
        )}
        {(menus?.tableRow?.enabled ?? true) && (
          <TableRowMenu
            editor={editor}
            tippyOptions={menus?.tableRow?.tippyOptions}
          />
        )}
        {(menus?.tableColumn?.enabled ?? true) && (
          <TableColumnMenu
            editor={editor}
            tippyOptions={menus?.tableColumn?.tippyOptions}
          />
        )}
        {(menus?.column?.enabled ?? true) && (
          <ColumnMenu
            editor={editor}
            tippyOptions={menus?.column?.tippyOptions}
          />
        )}
      </div>
    );
  },
);

TiptapEditor.displayName = "TiptapEditor";
