import React, { useEffect, useRef } from "react";
import { Editor, Range } from "slate";
import { useFocused, useSlateStatic } from "slate-react";
import { withPortal } from "../../portal";
import { SlateToolbar } from ".";

/**
 * Used currently in workbench, is shown when a range of text
 * is selected
 */
const HoveringToolbar = ({ isVisible = true }: { isVisible?: boolean }) => {
  const ref = useRef<HTMLDivElement>(null);
  const editor = useSlateStatic();
  const inFocus = useFocused();

  useEffect(() => {
    const el = ref.current;
    const { selection } = editor;

    if (!el) {
      return;
    }

    if (
      !selection ||
      !inFocus ||
      Range.isCollapsed(selection) ||
      Editor.string(editor, selection) === ""
    ) {
      el.removeAttribute("style");
      return;
    }

    function hide() {
      if (!el) return;
      el.style.opacity = "0";
    }

    addEventListener("wheel", hide);

    const domSelection = window.getSelection();

    if (domSelection) {
      try {
        const domRange = domSelection.getRangeAt(0);
        const rect = domRange.getBoundingClientRect();

        el.style.opacity = "1";
        el.style.position = "absolute";
        el.style.zIndex = "9999";
        el.style.top = `${rect.top + window.scrollY - el.offsetHeight - 8}px`;
        el.style.left = `${rect.left - 32}px`;
      } catch (e) {
        // silences `The index is not in the allowed range.` on safari
      }
    }

    return () => {
      removeEventListener("wheel", hide);
    };
  });

  if (!isVisible) return null;
  return (
    <SlateToolbar
      ref={ref}
      className="!mt-0 mb-2 !w-auto rounded-md border border-border bg-background p-0.5 opacity-0 transition-opacity"
      isHoveringToolbar
    />
  );
};

export default withPortal(HoveringToolbar);
