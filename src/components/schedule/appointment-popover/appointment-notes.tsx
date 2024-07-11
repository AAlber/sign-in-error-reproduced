import { useState } from "react";
import { useTranslation } from "react-i18next";
import { updateAppointmentNotes } from "@/src/client-functions/client-appointment";
import type { ScheduleAppointment } from "@/src/types/appointment.types";
import { FormattedTextArea } from "../../reusable/formatted-textarea";
import { useCreateFormattedTextarea } from "../../reusable/formatted-textarea/hooks";
import type {
  TiptapEditorFeatures,
  TiptapEditorMenus,
} from "../../tiptap-editor/types";
import useSchedule from "../zustand";

const formattedTextAreaFeatures: TiptapEditorFeatures = {
  blockquoteFigure: { enabled: false },
  heading: { enabled: false },
  table: { enabled: false },
  tableOfContent: { enabled: false },
  youtube: { enabled: false },
  imageUpload: { enabled: false },
  fileUpload: { enabled: false },
  columns: { enabled: false },
  codeBlock: { enabled: false },
  fileHandler: { enabled: false },
  placeholder: {
    enabled: true,
    placeholderContent: "appointment.notes.placeholder",
  },
  slashCommand: {
    omitSlashMenuCommand: [
      "blockquote-figure",
      "figure",
      "columns",
      "table-of-content",
      "code-block",
      "heading1",
      "heading2",
      "heading3",
    ],
  },
};

const formattedTextAreaMenus: TiptapEditorMenus = {
  textBubble: { enabled: false },
  contentDrag: { enabled: false },
};

export const AppointmentNotes = ({
  appointment,
  editable = false,
}: {
  appointment: ScheduleAppointment;
  editable?: boolean;
}) => {
  const { t } = useTranslation("page");
  const [notes, setNotes] = useState<string>(appointment.notes || "");
  const { setAppointmentNotes } = useSchedule();

  const formattedTextareaEditor = useCreateFormattedTextarea({
    className: "appointment-notes-editor",
    editable: editable,
    defaultContent: appointment.notes,
    features: formattedTextAreaFeatures,
    menus: formattedTextAreaMenus,
    onBlur: async () => {
      updateAppointmentNotes(appointment.id, notes);
      setAppointmentNotes(appointment.id, notes);
    },
    onUpdate: ({ editor }) => setNotes(editor.getHTML()),
  });

  return (
    <div className="flex size-full flex-col gap-2 pt-4 text-sm">
      <p>{t("Notes")}</p>
      <FormattedTextArea
        editor={formattedTextareaEditor}
        className="test max-h-36 !min-h-20 overflow-y-scroll rounded-md border border-input bg-foreground px-3 py-2 focus-within:outline-none focus-within:ring-1 focus-within:ring-primary"
      />
    </div>
  );
};
