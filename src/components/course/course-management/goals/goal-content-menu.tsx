import { MoreHorizontal } from "lucide-react";
import courseGoalHandler from "@/src/client-functions/client-course-goals";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/src/components/reusable/shadcn-ui/dropdown-menu";
import type { ContentBlock } from "@/src/types/course.types";

type Props = {
  layerId: string;
  block: ContentBlock;
  alreadySelectedBlocks: ContentBlock[];
  updateSelectedBlocks: (blocks: ContentBlock[]) => void;
};

export default function CourseManagementGoalContentMenu({
  layerId,
  block,
  alreadySelectedBlocks,
  updateSelectedBlocks,
}: Props) {
  const handleRemove = async () => {
    updateSelectedBlocks(
      alreadySelectedBlocks.filter((b) => b.id !== block.id),
    );

    const data = await courseGoalHandler.delete.contentBlock(layerId, block.id);
    if (!data.success) {
      updateSelectedBlocks([...alreadySelectedBlocks, block]);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <MoreHorizontal
          aria-hidden="true"
          className="h-5 w-5 text-muted-contrast hover:opacity-60"
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={handleRemove}>Remove</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
