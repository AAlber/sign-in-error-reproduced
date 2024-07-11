import type { Editor } from "@tiptap/react";
import merge from "lodash/merge";
import { TiptapEditor } from "../../tiptap-editor";
import type {
  TiptapEditorFeatures,
  TiptapEditorMenus,
} from "../../tiptap-editor/types";

interface Props {
  editor: {
    tiptapEditor: Editor | null;
    menus?: TiptapEditorMenus;
    features?: TiptapEditorFeatures;
  };
  className?: string;
}

const defaultMenus: TiptapEditorMenus = {
  contentDrag: { enabled: false },
  textBubble: {
    tippyOptions: { placement: "top-end", offset: [-100, 10] },
    subMenu: {
      ai: {
        enabled: false,
      },
      code: {
        enabled: false,
      },
      codeBlock: { enabled: false },
    },
  },
};

export const FormattedTextArea = ({ editor, className }: Props) => {
  return (
    editor.tiptapEditor && (
      <TiptapEditor
        className={className}
        editor={editor.tiptapEditor}
        menus={merge(defaultMenus, editor.menus)}
      />
    )
  );
};
