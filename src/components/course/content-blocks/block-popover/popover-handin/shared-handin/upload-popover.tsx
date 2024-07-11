import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/src/components/reusable/shadcn-ui/popover";
import type { ContentBlock } from "@/src/types/course.types";
import HandInPopover from "..";

export const SharedHandinUploadPopover = ({
  children,
  block,
  disabled,
}: {
  children: React.ReactNode;
  block: ContentBlock;
  disabled?: boolean;
}) => {
  return (
    <Popover>
      <PopoverTrigger disabled={disabled}>{children}</PopoverTrigger>
      <PopoverContent side="right">
        <HandInPopover block={block} />
      </PopoverContent>
    </Popover>
  );
};
