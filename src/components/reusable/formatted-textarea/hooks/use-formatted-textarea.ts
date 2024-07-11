import { useContext } from "react";
import { FormattedTextareaContext } from "../context/formatted-textarea-context";

export const useFormattedTextareaContext = () => {
  const editorCtx = useContext(FormattedTextareaContext);
  if (!editorCtx)
    throw new Error("Must be used within FormattedTextarea Provider");

  return { tiptapEditor: editorCtx.tiptapEditor };
};
