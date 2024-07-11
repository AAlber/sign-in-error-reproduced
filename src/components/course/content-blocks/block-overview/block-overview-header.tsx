import type { ContentBlock } from "@/src/types/course.types";
import PreviewDescription from "./block-overview-descriptipn";
import PreviewName from "./block-overview-name";
import BlockProperties from "./block-properties";

export default function PreviewHeader({ block }: { block: ContentBlock }) {
  return (
    <div className="flex w-full flex-col gap-2">
      <PreviewName block={block} />
      <PreviewDescription block={block} />
      <BlockProperties block={block} />
    </div>
  );
}
