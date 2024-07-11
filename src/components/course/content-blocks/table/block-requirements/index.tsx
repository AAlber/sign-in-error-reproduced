import type { ContentBlock } from "@/src/types/course.types";
import useCourse from "../../../zustand";
import AddRequirement from "./add-requirement";
import RequirementListItem from "./requirements-list-item";
import RequirementListMultiItemsIndicator from "./requirements-list-multi-items";

export default function RequirementList({ block }: { block: ContentBlock }) {
  const { hasSpecialRole, contentBlocks } = useCourse();

  return (
    <div className="flex w-[300px] flex-wrap items-center gap-1 text-sm text-muted-contrast">
      {block?.requirements && block.requirements.length > 0 ? (
        <>
          {block?.requirements.length === 1 ? (
            <RequirementListItem
              key={block.requirements[0]!.id}
              blockId={block.id}
              requirement={block.requirements[0]!}
            />
          ) : (
            <RequirementListMultiItemsIndicator block={block} />
          )}
          {hasSpecialRole &&
            block.requirements.length < contentBlocks.length - 1 && (
              <AddRequirement block={block} />
            )}
        </>
      ) : (
        <AddRequirement block={block} />
      )}
    </div>
  );
}
