import type { UserNotes } from "@prisma/client";
import type { JSONContent } from "@tiptap/react";
import { useState } from "react";
import {
  deleteUserNotes,
  updateUserNotes,
} from "@/src/client-functions/client-user-notes";
import { log } from "@/src/utils/logger/logger";
import { NotesActionButtons } from "../../components/note-action-buttons";
import { UserNoteEditor } from "../../components/user-notes-editor";

interface Props {
  note: UserNotes;
}

export const UserNoteContent = ({ note }: Props) => {
  const [updatedNote, setUpdatedNote] = useState<JSONContent>(
    note.data as JSONContent,
  );
  return (
    <>
      <UserNoteEditor
        content={note.data as JSONContent}
        onUpdate={(content) => {
          setUpdatedNote(content);
        }}
      />
      <NotesActionButtons
        type="update"
        isSavingEnabled={!objectsAreEqual(note.data, updatedNote)}
        onCancel={async () => {
          log.click("cancel note button clicked");
          await deleteUserNotes(note.id);
        }}
        onMainAction={async () => {
          log.click("update note button clicked");
          await updateUserNotes(note.id, updatedNote);
        }}
      />
    </>
  );
};

type AnyObject = { [key: string]: any };

function objectsAreEqual(obj1: any, obj2: any): boolean {
  // If both are the same reference or both are null/undefined
  if (obj1 === obj2) {
    return true;
  }

  // If either is null or not the same type
  if (!obj1 || !obj2 || typeof obj1 !== "object" || typeof obj2 !== "object") {
    return false;
  }

  // Compare arrays
  if (Array.isArray(obj1) && Array.isArray(obj2)) {
    if (obj1.length !== obj2.length) {
      return false;
    }
    for (let i = 0; i < obj1.length; i++) {
      if (!objectsAreEqual(obj1[i], obj2[i])) {
        return false;
      }
    }
    return true;
  }

  // Compare object keys and their types
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);
  if (keys1.length !== keys2.length) {
    return false;
  }

  // Recursively compare properties
  for (const key of keys1) {
    if (!keys2.includes(key)) {
      return false;
    }
    if (!objectsAreEqual(obj1[key], obj2[key])) {
      return false;
    }
  }

  return true;
}
