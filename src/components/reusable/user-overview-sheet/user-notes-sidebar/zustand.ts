import type { UserNotes } from "@prisma/client";
import { create } from "zustand";

type UserNotesState = {
  userNotes: UserNotes[];
  setUserNotes: (userNotes: UserNotes[]) => void;
  newUserNote: (userNote: UserNotes) => void;
  insertUserNoteAt: (userNote: UserNotes, index: number) => void;
  updateUserNote: (userNote: UserNotes) => void;
  deleteUserNote: (
    userNoteId: string,
  ) => { note: UserNotes; index: number } | undefined;
};

export const useUserNotes = create<UserNotesState>((set, get) => ({
  userNotes: [],
  setUserNotes: (userNotes) => set({ userNotes }),
  newUserNote: (userNote) => {
    const userNotes = get().userNotes;
    userNotes.push(userNote);

    set({ userNotes });
  },
  insertUserNoteAt: (userNote, index) => {
    const userNotes = get().userNotes;
    userNotes.splice(index, 0, userNote);

    set({ userNotes });
  },
  updateUserNote: (userNote) => {
    const userNotes = get().userNotes;
    const index = userNotes.findIndex((note) => note.id === userNote.id);
    if (index === -1) return;
    userNotes[index] = userNote;

    set({ userNotes });
  },
  deleteUserNote: (userNoteId) => {
    const userNotes = get().userNotes;
    const index = userNotes.findIndex((note) => note.id === userNoteId);
    if (index === -1) return;

    const deletedNote = userNotes.splice(index, 1);

    set({ userNotes });

    return deletedNote[0] && { note: deletedNote[0], index };
  },
}));
