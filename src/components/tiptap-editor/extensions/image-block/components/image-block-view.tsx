import type { Node } from "@tiptap/pm/model";
import type { Editor } from "@tiptap/react";
import { NodeViewWrapper } from "@tiptap/react";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { proxyCloudflareReadRequest } from "@/src/client-functions/client-cloudflare/utils";
import classNames from "@/src/client-functions/client-utils";
import Spinner from "@/src/components/spinner";

interface Props {
  editor: Editor;
  getPos: () => number;
  node: Node & {
    attrs: {
      src: string;
    };
  };
  updateAttributes: (attrs: Record<string, string>) => void;
}

export const ImageBlockView = (props: Props) => {
  const { editor, getPos, node } = props;
  const imageWrapperRef = useRef<HTMLDivElement>(null);
  const { src } = node.attrs;

  const wrapperClassName = classNames(
    "py-2",
    node.attrs.align === "left" ? "ml-0" : "ml-auto",
    node.attrs.align === "right" ? "mr-0" : "mr-auto",
    node.attrs.align === "center" && "mx-auto",
  );

  const onClick = useCallback(() => {
    editor.commands.setNodeSelection(getPos());
  }, [getPos, editor.commands]);

  const [url, setUrl] = useState(src);

  useEffect(() => {
    proxyCloudflareReadRequest(src).then((key) => {
      setUrl(key);
    });
  }, [src]);
  console.log("url", url);

  return (
    <NodeViewWrapper>
      <div className={wrapperClassName} style={{ width: node.attrs.width }}>
        <div contentEditable={false} ref={imageWrapperRef}>
          {url === src &&
          src.startsWith(process.env.NEXT_PUBLIC_WORKER_URL!) ? (
            <div className="flex h-[100px] items-center justify-center">
              <Spinner className="h-4 w-4" />
            </div>
          ) : (
            <Image
              referrerPolicy="origin"
              width={800}
              height={500}
              src={url}
              alt=""
              onClick={onClick}
            />
          )}
        </div>
      </div>
    </NodeViewWrapper>
  );
};

export default ImageBlockView;
