import type { JSONContent } from "@tiptap/react";
import dayjs from "dayjs";
import { Pencil } from "lucide-react";
import { useTranslation } from "react-i18next";
import { updateUserNotes } from "@/src/client-functions/client-user-notes";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/src/components/reusable/shadcn-ui/accordion";
import { PopoverStringInput } from "../../../popover-string-input";
import { Button } from "../../../shadcn-ui/button";
import { useUserNotes } from "../zustand";
import { UserNoteContent } from "./user-note-content";

export const UserNotesList = () => {
  const { userNotes } = useUserNotes();
  const { t } = useTranslation("page");

  return (
    <div className="py-2">
    <Accordion type="single" collapsible>
      {userNotes
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        )
        .map((note, index) => (
          <AccordionItem className="border-b-0 px-2 py-1" key={index} value={note.id}>
            <AccordionTrigger className="px-3 py-1 !no-underline rounded-md hover:bg-muted/30">
              <div className="text-start text-sm w-full">
                <div className="flex gap-x-1">
                  <div className="my-auto font-normal text-sm text-contrast">
                    {note.noteName
                      ? note.noteName
                      : dayjs(note.createdAt).format("DD MMM YYYY - HH:mm")}
                  </div>
                  <PopoverStringInput
                    actionName="user_notes.change_name"
                    onSubmit={async (name) => {
                      await updateUserNotes(
                        note.id,
                        note.data as JSONContent,
                        name,
                      );
                    }}
                  >
                    <Button variant="ghost" size="iconSm" className="">
                      <Pencil className="h-3 w-3" />
                    </Button>
                  </PopoverStringInput>
                </div>
                <p className="font text-xs text-muted-contrast">
                  {t("user_notes.created_by")} {note.creatorName}
                </p>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pt-2">
              <UserNoteContent note={note} />
            </AccordionContent>
          </AccordionItem>
        ))}
    </Accordion></div>
  );
};