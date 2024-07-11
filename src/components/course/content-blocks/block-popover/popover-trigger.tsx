import { PopoverTrigger } from "@/src/components/reusable/shadcn-ui/popover";
import { useBlockSettings } from "./hooks/use-block-settings";

export const BlockTrigger = ({ blockId, children, block }) => {
  const { logClick } = useBlockSettings({
    blockId,
    block,
  });

  return (
    <PopoverTrigger onClick={() => logClick("Content Block Popover", blockId)}>
      {children}
    </PopoverTrigger>
  );
};
