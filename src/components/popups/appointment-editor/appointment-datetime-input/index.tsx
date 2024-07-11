import dayjs from "dayjs";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { AITextTransformerButton } from "@/src/components/reusable/ai-tool";
import { DatePicker } from "@/src/components/reusable/date-time-picker/date-picker";
import TimePicker from "@/src/components/reusable/date-time-picker/time-picker";
import { FormattedTextArea } from "@/src/components/reusable/formatted-textarea";
import { useCreateFormattedTextarea } from "@/src/components/reusable/formatted-textarea/hooks";
import Form from "@/src/components/reusable/formlayout";
import Input from "@/src/components/reusable/input";
import { Button } from "@/src/components/reusable/shadcn-ui/button";
import { Separator } from "@/src/components/reusable/shadcn-ui/separator";
import type {
  TiptapEditorFeatures,
  TiptapEditorMenus,
} from "@/src/components/tiptap-editor/types";
import useUser from "@/src/zustand/user";
import { isDateOlderThanCurrentDate } from "../../../../client-functions/client-rrule-utils";
import {
  handleSetDate,
  handleSetDateTimeNow,
  handleSetTime,
} from "../functions";
import usePersistAppointmentEditor from "../persist-appointment-editor-zustand";
import useAppointmentEditor from "../zustand";
import AppointmentRecurrenceSelector from "./recurrence-options";
import DurationSelector from "./recurrence-options/duration-selector";
import AIAppointmentFillout from "./ai-appointment-fillout";

export type DurationItem = {
  label: string;
  value: number;
};

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

export default function AppointmentNameAndDateTime() {
  const { user } = useUser();
  dayjs.locale(user.language);
  const {
    title,
    notes,
    editSeries,
    isSettingsMode,
    duration,
    setTitle,
    setNotes,
    initSource,
    dateTime,
  } = useAppointmentEditor();

  const { dateTime: persistedDateTime } = usePersistAppointmentEditor();

  const [selectedDuration, setSelectedDuration] = useState<number>(
    Number(duration) ||
      user.institution?.institutionSettings.appointment_default_duration ||
      0,
  );

  const isDefaultInit = initSource === "default";
  const maybeUsePersistedDateTime = isDateOlderThanCurrentDate(
    persistedDateTime,
  )
    ? dateTime
    : persistedDateTime;
  const dateAndTime = isDefaultInit ? maybeUsePersistedDateTime : dateTime;

  const { t } = useTranslation("page");

  const formattedTextareaEditor = useCreateFormattedTextarea({
    className: "appointment-notes-editor",
    defaultContent: notes,
    features: formattedTextAreaFeatures,
    menus: formattedTextAreaMenus,
    onUpdate: ({ editor }) => setNotes(editor.getHTML()),
  });

  const handleAICompletion = (improvedText) => {
    setNotes(improvedText);
    if (formattedTextareaEditor.tiptapEditor) {
      formattedTextareaEditor.tiptapEditor.commands.setContent(improvedText);
    }
  };

  return (
    <div className="grid grid-cols-4 gap-2">
      <div className="col-span-4">
        <Form>
          <Form.Item label="appointments.title">
            <Input
              text={title}
              setText={setTitle}
              placeholder="appointments_title.placeholder"
              maxLength={200}
            />
          </Form.Item>
          <Form.Item label="appointments.notes">
            <div className="relative w-full">
              <FormattedTextArea
                editor={formattedTextareaEditor}
                className="max-h-36 !min-h-20 overflow-y-scroll rounded-md border border-input bg-foreground px-3 py-2 text-sm focus-within:outline-none focus-within:ring-1 focus-within:ring-primary"
              />
              <div className="absolute right-1 top-1">
                <AITextTransformerButton
                  text={notes}
                  onCompletion={handleAICompletion}
                  tooltipText={"text_improver_ai"}
                  variant={"ghost"}
                  disabled={!notes}
                />
              </div>
            </div>
          </Form.Item>
        </Form>
      </div>
      <div className="col-span-4 mt-0.5">
        <Separator />
      </div>
      <h2 className="mt-2 text-sm text-contrast"> {t("navbar.schedule")}</h2>
      <AIAppointmentFillout />
      <div className="col-span-4 flex items-center gap-2">
        <div className="flex w-full gap-2">
          <div className="w-[200px]">
            <DatePicker
              onChange={handleSetDate}
              placeholder="appointment_modal.date_picker_placeholder"
              date={dateAndTime}
              position="bottom"
            />
          </div>

          <TimePicker onSelect={handleSetTime} dateTime={dateAndTime} />
          <DurationSelector
            value={selectedDuration}
            onChange={(value) => setSelectedDuration(value)}
          />
        </div>

        <Button
          onClick={handleSetDateTimeNow}
          variant={"default"}
          size={"default"}
        >
          {t("appointment_modal.date_and_time_now")}
        </Button>
      </div>
      {!(!editSeries && isSettingsMode) && <AppointmentRecurrenceSelector />}
    </div>
  );
}
