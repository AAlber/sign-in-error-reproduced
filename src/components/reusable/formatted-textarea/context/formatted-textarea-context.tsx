import type { Editor } from "@tiptap/react";
import type { FC } from "react";
import { createContext, useState } from "react";

type FormattedTextAreaContextType = {
  tiptapEditor?: Editor;
  initTiptapEditor: (editor: Editor) => void;
};

export const FormattedTextareaContext =
  createContext<FormattedTextAreaContextType | null>(null);

interface Props {
  children: React.ReactNode;
}

export const FormattedTextareaProvider: FC<Props> = ({ children }) => {
  const [tiptapEditor, setTiptapEditor] = useState<Editor | undefined>();

  const initTiptapEditor = (editor: Editor) => {
    setTiptapEditor(editor);
  };

  return (
    <FormattedTextareaContext.Provider
      value={{ tiptapEditor, initTiptapEditor }}
    >
      {children}
    </FormattedTextareaContext.Provider>
  );
};
