import { MoreHorizontal } from "lucide-react";
import { isBlockOfType } from "@/src/client-functions/client-contentblock/utils";
import { Button } from "@/src/components/reusable/shadcn-ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/src/components/reusable/shadcn-ui/dropdown-menu";
import type { ContentBlock } from "@/src/types/course.types";
import BlockOptionDelete from "./block-option-delete";
import BlockOptionDuplicate from "./block-option-duplicate";
import BlockOptionManageBlock from "./block-option-manage-block";
import BlockOptionSetStatus from "./block-option-set-status";

export default function BlockOptions({ block }: { block: ContentBlock }) {
  const isDividerBlock = isBlockOfType(block, "Section");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="w-full text-center">
          <Button
            variant="ghost"
            size={"iconSm"}
            className="text-muted-contrast hover:opacity-60"
          >
            <MoreHorizontal className="h-5 w-5" />
          </Button>
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="start"
        side="left"
        alignOffset={-10}
        sideOffset={-10}
        className="mr-5 w-[200px] !shadow-none focus:outline-none"
      >
        <DropdownMenuGroup>
          {!isDividerBlock && (
            <>
              <BlockOptionManageBlock block={block} />
              <BlockOptionSetStatus block={block} />
              <BlockOptionDuplicate block={block} />
              <DropdownMenuSeparator />
            </>
          )}
          <BlockOptionDelete block={block} />
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
