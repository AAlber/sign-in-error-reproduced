import type { NodeViewWrapperProps } from "@tiptap/react";
import { NodeViewContent, NodeViewWrapper } from "@tiptap/react";
import { type ChangeEvent, useEffect, useRef } from "react";
import { useEditor } from "@/src/components/editor/zustand";

export const MultipleChoiceItemView = ({
  node,
  updateAttributes,
}: NodeViewWrapperProps) => {
  const { canCreate } = useEditor();
  const checkInputRef = useRef<HTMLInputElement>(null);

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    updateAttributes({
      checked: event.target.checked,
    });

    event.target.checked
      ? event.target.setAttribute("checked", "checked")
      : event.target.removeAttribute("checked");
  };

  useEffect(() => {
    if (node.attrs.checked) {
      checkInputRef.current?.setAttribute("checked", "checked");
    }
  }, []);

  return (
    <NodeViewWrapper className="flex w-full">
      <input
        checked={node.attrs.checked}
        disabled={canCreate}
        type="checkbox"
        onChange={onChange}
        ref={checkInputRef}
      />
      <NodeViewContent />
    </NodeViewWrapper>
  );
};
