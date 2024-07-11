import type { JSONContent } from "@tiptap/react";
import { FormattedTextArea } from "@/src/components/reusable/formatted-textarea";
import { useCreateFormattedTextarea } from "@/src/components/reusable/formatted-textarea/hooks";

interface Props {
  content?: JSONContent;
  onUpdate: (content: JSONContent) => void;
}

export const UserNoteEditor = ({ content, onUpdate }: Props) => {
  const formattedTextareaEditor = useCreateFormattedTextarea({
    defaultContent: content,
    features: {
      slashCommand: {
        omitSlashMenuCommand: [
          "code-block",
          "youtube",
          "image",
          "file",
          "table",
          "table-of-content",
          "columns",
        ],
      },
    },
    menus: {
      textBubble: {
        tippyOptions: { placement: "top-end", offset: [0, 10] },
      },
    },
    onUpdate: ({ editor }) => {
      onUpdate(editor.getJSON());
    },
  });

  return (
    <FormattedTextArea
      editor={formattedTextareaEditor}
      className="h-[350px] overflow-y-scroll"
    />
  );
};
