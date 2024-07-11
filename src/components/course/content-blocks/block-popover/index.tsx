import clsx from "clsx";
import { useTranslation } from "react-i18next";
import contentBlockHandler from "@/src/client-functions/client-contentblock/handler";
import {
  Popover,
  PopoverContent,
} from "@/src/components/reusable/shadcn-ui/popover";
import type { ContentBlock } from "@/src/types/course.types";
import { TabsArea } from "./content-tabs";
import { useBlockSettings } from "./hooks/use-block-settings";
import { BlockPopoverHeader } from "./popover-header";
import { BlockTrigger } from "./popover-trigger";

export default function ContentBlockPopover({
  block,
  disabled,
  children,
}: {
  block: ContentBlock;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  const { t } = useTranslation("page");
  const {
    isPopoverOpen,
    openPopover,
    blockConfig,
    isFeedbackEnabled,
    canGiveRating,
  } = useBlockSettings({ blockId: block.id, block });

  const registredBlock = contentBlockHandler.get.registeredContentBlockByType(
    block.type,
  );

  if (!blockConfig) return null;

  return (
    <Popover open={isPopoverOpen} onOpenChange={openPopover}>
      <BlockTrigger blockId={block.id} block={block}>
        {children}
      </BlockTrigger>
      <PopoverContent
        side="right"
        className={clsx(
          "ml-14 w-[350px]",
          disabled ? "bg-muted/5 dark:bg-muted/40" : "bg-foreground",
        )}
      >
        <BlockPopoverHeader
          block={block}
          disabled={disabled}
          registredBlock={registredBlock}
        />
        {!disabled && (
          <TabsArea
            block={block}
            isFeedbackEnabled={isFeedbackEnabled}
            canGiveRating={canGiveRating}
          />
        )}{" "}
      </PopoverContent>
    </Popover>
  );
}
