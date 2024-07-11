import type { ContentBlock } from "@/src/types/course.types";
import PropertyDueDate from "./due-date";
import { OverviewFeedback } from "./feedback";
import PropertyStartDate from "./start-date";
import PropertyType from "./type";

export default function BlockProperties({ block }: { block: ContentBlock }) {
  return (
    <div className="relative z-20 mt-1 flex flex-wrap gap-2 ">
      <PropertyType block={block} />
      <PropertyStartDate block={block} />
      <PropertyDueDate block={block} />
      <OverviewFeedback block={block} />
    </div>
  );
}
