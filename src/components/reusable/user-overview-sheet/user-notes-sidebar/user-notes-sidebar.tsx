import type { JSONContent } from "@tiptap/react";
import { Notebook, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  createUserNotes,
  getUserNotes,
} from "@/src/client-functions/client-user-notes";
import Skeleton from "@/src/components/skeleton";
import { log } from "@/src/utils/logger/logger";
import { EmptyState } from "../../empty-state";
import { FormattedTextareaProvider } from "../../formatted-textarea/context/formatted-textarea-context";
import { Button } from "../../shadcn-ui/button";
import { useUserOverview } from "../zustand";
import { NotesActionButtons, UserNoteEditor } from "./components";
import { UserNotesList } from "./user-notes-list";
import { useUserNotes } from "./zustand";

export const UserNotesSidebar = () => {
  const { user } = useUserOverview();
  const { userNotes } = useUserNotes();
  const [loading, setLoading] = useState<boolean>(true);
  const [createNote, setCreateNote] = useState<boolean>(false);

  const [newNote, setNewNote] = useState<JSONContent | undefined>();
  const { t } = useTranslation("page");

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    getUserNotes(user.id).finally(() => setLoading(false));
  }, [user?.id]);

  if (!user) return null;

  return (
    <FormattedTextareaProvider>
      <div className="flex h-full w-full max-w-[350px] flex-col">
        <div className="flex h-14 items-center border-b border-border bg-foreground p-4">
          <div className="flex flex-col gap-0">
            <h1 className="text-sm">{t("notes")}</h1>
            <p className="text-xs text-muted-contrast"> {t("note_subtitle")}</p>
          </div>
          {!createNote && (
            <Button
              variant={"ghost"}
              size={"icon"}
              className="ml-auto"
              disabled={loading}
              onClick={() => {
                log.click("add notes button clicked");
                setCreateNote(true);
              }}
            >
              <Plus className="h-4 w-4 text-primary" />
            </Button>
          )}
        </div>
        {loading ? (
          <div className="h-full">
            <Skeleton />
          </div>
        ) : (
          <>
            {createNote && (
              <div className="p-4">
                <UserNoteEditor
                  content={newNote}
                  onUpdate={(content) => {
                    setNewNote(content);
                  }}
                />
                <NotesActionButtons
                  type="new"
                  onCancel={() => {
                    log.click("cancel button clicked");
                    setNewNote(undefined);
                    setCreateNote(false);
                  }}
                  isSavingEnabled
                  onMainAction={async () => {
                    log.click("create note button clicked");
                    if (!newNote) return;
                    await createUserNotes(user.id, newNote).then((note) => {
                      if (!note) return;
                      setNewNote(undefined);
                      setCreateNote(false);
                    });
                  }}
                />
              </div>
            )}
            {userNotes.length > 0 && <UserNotesList />}
            {!createNote && userNotes.length <= 0 && (
              <EmptyState
                icon={Notebook}
                title={t("user_notes.no_notes")}
                description={t("user_notes.no_notes.description")}
                className="px-4"
              >
                <Button
                  variant={"cta"}
                  size={"default"}
                  onClick={() => {
                    log.click("add notes button clicked");
                    setCreateNote(true);
                  }}
                >
                  {t("user_notes.no_notes.add_note")}
                </Button>
              </EmptyState>
            )}
          </>
        )}
      </div>
    </FormattedTextareaProvider>
  );
};
