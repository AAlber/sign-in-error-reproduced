import type { UserNotes } from "@prisma/client";
import type { JSONContent } from "@tiptap/react";
import { toast } from "../components/reusable/toaster/toast";
import { useUserNotes } from "../components/reusable/user-overview-sheet/user-notes-sidebar/zustand";
import api from "../pages/api/api";
import confirmAction from "./client-options-modal";

export const getUserNotes = async (userId: string) => {
  const { setUserNotes } = useUserNotes.getState();

  const response = await fetch(api.getUserNotes + "?userId=" + userId, {
    method: "GET",
  });

  if (!response.ok) {
    toast.responseError({
      response,
      title: "toast_user_notes_fetch_error",
    });
    return;
  }

  const notes = (await response.json()) as UserNotes[];

  setUserNotes(notes);

  return notes;
};

export const createUserNotes = async (
  userId: string,
  data: JSONContent,
  noteName?: string,
) => {
  const { newUserNote } = useUserNotes.getState();

  const response = await fetch(api.createUserNotes, {
    method: "POST",
    body: JSON.stringify({ userId, data, noteName }),
  });

  if (!response.ok) {
    toast.responseError({
      response,
      title: "toast_user_notes_error",
    });
    return;
  }

  const note = (await response.json()) as UserNotes;

  newUserNote(note);

  return note;
};

export const updateUserNotes = async (
  noteId: string,
  data: JSONContent,
  noteName?: string,
) => {
  const { updateUserNote } = useUserNotes.getState();

  const response = await fetch(api.updateUserNotes + "?noteId=" + noteId, {
    method: "PATCH",
    body: JSON.stringify({ data, noteName }),
  });
  if (!response.ok) {
    toast.responseError({
      response,
      title: "toast_user_notes_error",
    });
    return;
  }

  const note = (await response.json()) as UserNotes;

  updateUserNote(note);

  return note;
};

export const deleteUserNotes = async (noteId: string) => {
  confirmAction(
    async () => {
      const { deleteUserNote } = useUserNotes.getState();

      const response = await fetch(api.deleteUserNotes + "?noteId=" + noteId, {
        method: "DELETE",
      });

      if (!response.ok) {
        toast.responseError({
          response,
          title: "toast_user_notes_error",
        });
        return;
      }

      const note = (await response.json()) as UserNotes;

      deleteUserNote(note.id);
    },
    {
      actionName: "Delete",
      description: `Are you sure you want to delete this note?`,
      dangerousAction: true,
      allowCancel: true,
      title: "Delete Note",
    },
  );
};
