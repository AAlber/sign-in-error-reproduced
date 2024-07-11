import type { Node } from "@tiptap/pm/model";
import type { Editor } from "@tiptap/react";
import { NodeViewWrapper } from "@tiptap/react";
import { FileUp } from "lucide-react";
import { getFilenameFromUrl } from "pdfjs-dist";
import { useState } from "react";
import { downloadFileFromUrl } from "@/src/client-functions/client-utils";
import Spinner from "@/src/components/spinner";

interface Props {
  editor: Editor;
  getPos: () => number;
  node: Node & {
    attrs: {
      src: string;
      name: string;
    };
  };
  updateAttributes: (attrs: Record<string, string>) => void;
}

export const FileBlockView = (props: Props) => {
  const { node } = props;
  const { src, name } = node.attrs;
  const [loading, setLoading] = useState(false);
  return (
    <NodeViewWrapper>
      <div
        contentEditable={false}
        className="rounded-md  hover:bg-gray-500/50"
        data-src={src}
        data-name={name}
      >
        <div
          className="flex w-full gap-x-1 p-2"
          onClick={async () => {
            setLoading(true);
            await downloadFileFromUrl(getFilenameFromUrl(name), src);
            setLoading(false);
          }}
        >
          {loading ? (
            <Spinner size="h-4 w-4 mt-[3px]" />
          ) : (
            <FileUp className="my-auto size-5" />
          )}
          <p className="my-auto">{name}</p>
        </div>
      </div>
    </NodeViewWrapper>
  );
};
