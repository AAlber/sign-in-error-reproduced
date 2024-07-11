import clsx from "clsx";
import throttle from "lodash/throttle";
import { type KeyboardEvent, useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
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
import type { IParagraphElementProps } from "./types";

const Editor: React.FC<IParagraphElementProps> = (props) => {
  const { updateElementMetadata } = useWorkbench();
  const { elementId, paragraph } = props;

  const renderElementComponent = useCallback(renderElement, []);
  const renderLeafComponent = useCallback(renderLeaf, []);
  const editor = useSlateStatic();

  const { keyboardEventsHandler } = useKeyboardEvents();

  const defaultKeyboardEvents = useCallback(
    keyboardEventsHandler({
      editor,
    }),
    [editor],
  );

  function handleUpdateMeta() {
    const html = generateHtml(editor);
    if (areObjectsValueEqual({ paragraph: html }, { paragraph })) return;
    updateElementMetadata(elementId, { text: html });
  }

  const throttledUpdateMeta = throttle(handleUpdateMeta, 500);
  const handleKeyDown = useCallback((e: KeyboardEvent<HTMLDivElement>) => {
    defaultKeyboardEvents(e);
    throttledUpdateMeta();
  }, []);

  const { t } = useTranslation("page");

  return (
    <div className="px-2 py-1">
      <SlateToolbar />
      <HoveringToolbar />
      <Editable
        renderElement={renderElementComponent}
        renderLeaf={renderLeafComponent}
        spellCheck
        className="m-2 !min-h-[44px] bg-foreground text-sm text-contrast ring-0 placeholder:!text-muted-contrast focus:outline-none"
        placeholder={t("workbench.sidebar_element_paragraph_input_placeholder")}
        onKeyDown={handleKeyDown}
        onBlur={handleUpdateMeta}
      />
    </div>
  );
};

const CreateMode: React.FC<IParagraphElementProps> = (props) => {
  const { elementId, paragraph } = props;
  const [initialValue, setInitialValue] = useState<Descendant[]>();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let fragment: Descendant[] | undefined;
    if (paragraph) {
      const parsed = new DOMParser().parseFromString(paragraph, "text/html");
      fragment = deserializeHtml(parsed.body);
    }

    setInitialValue(fragment ?? slateInitialValue);
  }, []);

  useEffect(() => {
    if (typeof initialValue !== "undefined" && !isReady) {
      setIsReady(true);
    }
  }, [initialValue]);

  /**
   * Show small transition to avoid element ui
   * from jumping due to initialValue not yet ready
   */
  return (
    <div
      className={clsx(
        "transition-all duration-500",
        isReady ? "max-h-[999px]" : "max-h-0",
      )}
    >
      {initialValue && (
        <SlateProvider initialValue={initialValue} isChatMode={false}>
          <Editor elementId={elementId} paragraph={paragraph} />
        </SlateProvider>
      )}
    </div>
  );
};

export default CreateMode;
