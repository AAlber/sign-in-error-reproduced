import type { JSONContent } from "@tiptap/react";
import { useState } from "react";
import { updateUserNotes } from "@/src/client-functions/client-user-notes";
import Skeleton from "../../skeleton";
import { FormattedTextArea } from "../formatted-textarea";
import { useCreateFormattedTextarea } from "../formatted-textarea/hooks";

interface Props {
  userId: string;
}

export const UserNotesEditor = ({ userId }: Props): JSX.Element => {
  const [editedUserNotes, setEditedUserNotes] = useState<JSONContent | null>(
    null,
  );
  const [userNotes, setUserNotes] = useState<JSONContent>();
  const [loading, setLoading] = useState(true);

  const handleBlurSave = async () => {
    if (!editedUserNotes) return;

    await updateUserNotes(userId, editedUserNotes);

    setEditedUserNotes(null);
  };

  const formattedTextareaEditor = useCreateFormattedTextarea({
    defaultContent: userNotes,
    onBlur: handleBlurSave,
    onUpdate: ({ editor }) => {
      setEditedUserNotes(editor.getJSON());
    },
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
        tippyOptions: { placement: "top-end", offset: [-100, 10] },
      },
    },
  });

  // useEffect(() => {
  //   setLoading(true);
  //   getUserNotes(userId)
  //     .then((notes) => {
  //       setUserNotes(notes?.data as JSONContent);
  //     })
  //     .finally(() => {
  //       setLoading(false);
  //     });
  // }, []);

  return (
    <>
      {loading ? (
        <div className="h-[350px] rounded border border-border">
          <Skeleton />
        </div>
      ) : (
        <FormattedTextArea
          editor={formattedTextareaEditor}
          className="h-[350px] overflow-y-scroll rounded border border-border p-2"
        />
      )}
    </>
  );
};
