import { useCallback, useEffect, useState } from "react";
import type { Descendant } from "slate";
import { Editable, useSlateStatic } from "slate-react";
import { areObjectsValueEqual } from "@/src/client-functions/client-workbench";
import {
  renderElement,
  renderLeaf,
  slateInitialValue,
  SlateProvider,
  SlateToolbar,
} from "@/src/components/slate";
import useKeyboardEvents from "@/src/components/slate/hooks/useKeyboardEvents";
import HoveringToolbar from "@/src/components/slate/toolbar/hovering-toolbar";
import { deserializeHtml, generateHtml } from "@/src/components/slate/utils";
import useWorkbench from "../../../zustand";
import type { ITextElementProps } from "./types";

const FilloutMode: React.FC<ITextElementProps> = (props) => {
  const { answer, elementId } = props;
  const [initialValue, setInitialValue] = useState<Descendant[]>();

  useEffect(() => {
    let fragment: Descendant[] | undefined;
    if (answer) {
      const parsed = new DOMParser().parseFromString(answer, "text/html");
      fragment = deserializeHtml(parsed.body);
    }

    setInitialValue(fragment ?? slateInitialValue);
  }, []);

  if (!initialValue) return null;
  return (
    <SlateProvider initialValue={initialValue} isChatMode={false}>
      <Editor answer={answer} elementId={elementId} />
    </SlateProvider>
  );
};

const Editor: React.FC<ITextElementProps> = (props) => {
  const { updateElementMetadata } = useWorkbench();
  const { elementId, answer } = props;

  const renderElementComponent = useCallback(renderElement, []);
  const renderLeafComponent = useCallback(renderLeaf, []);
  const editor = useSlateStatic();

  const { keyboardEventsHandler } = useKeyboardEvents();
  const defaultKeyboardEvents = useCallback(keyboardEventsHandler({ editor }), [
    editor,
  ]);

  function handleUpdateMeta() {
    const html = generateHtml(editor);
    if (areObjectsValueEqual({ answer: html }, { answer })) return;
    updateElementMetadata(elementId, { answer: html });
  }

  return (
    <>
      <SlateToolbar />
      <HoveringToolbar />
      <Editable
        renderElement={renderElementComponent}
        renderLeaf={renderLeafComponent}
        spellCheck
        className="mt-2 !min-h-[44px] rounded-lg bg-background p-2 text-sm text-contrast"
        placeholder={"..."}
        onKeyDown={defaultKeyboardEvents}
        onBlur={handleUpdateMeta}
      />
    </>
  );
};

export default FilloutMode;
