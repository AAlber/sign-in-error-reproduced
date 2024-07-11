import type { NodeViewRendererProps } from "@tiptap/react";
import { NodeViewWrapper } from "@tiptap/react";
import { TableOfContent } from "./table-of-content";

export const TableOfContentNodeView = (props: NodeViewRendererProps) => {
  const { editor } = props;

  return (
    <NodeViewWrapper>
      <div className="my-6 rounded-lg" contentEditable={false}>
        <TableOfContent editor={editor} />
      </div>
    </NodeViewWrapper>
  );
};
