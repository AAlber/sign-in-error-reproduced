import type { Editor, NodeViewWrapperProps } from "@tiptap/react";
import { NodeViewContent, NodeViewWrapper } from "@tiptap/react";
import type { ChangeEvent } from "react";
import { useEffect, useRef } from "react";
import { useEditor } from "@/src/components/editor/zustand";

export const SingleChoiceItemView = ({
  editor,
  node,
  updateAttributes,
}: NodeViewWrapperProps) => {
  const { canCreate } = useEditor();
  const radioInputRef = useRef<HTMLInputElement>(null);

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      (editor as Editor)
        .chain()
        .focus()
        .selectParentNode()
        .updateAttributes("singleChoice", { checkedValue: event.target.value })
        .run();
    }
  };

  useEffect(() => {
    if (radioInputRef.current?.value) {
      updateAttributes({
        choiceValue: radioInputRef.current?.value,
      });
    } else {
      radioInputRef.current?.value
        ? (radioInputRef.current.value = node.attrs.choiceValue)
        : null;
    }
  }, []);

  return (
    <NodeViewWrapper className="flex w-full">
      <input
        disabled={canCreate}
        type="radio"
        ref={radioInputRef}
        onChange={onChange}
        value={node.attrs.choiceValue}
      />
      <NodeViewContent />
    </NodeViewWrapper>
  );
};
