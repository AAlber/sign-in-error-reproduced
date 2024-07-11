import type { Column } from "@tanstack/react-table";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import contentBlockHandler from "@/src/client-functions/client-contentblock/handler";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/src/components/reusable/shadcn-ui/popover";
import { Separator } from "@/src/components/reusable/shadcn-ui/separator";
import type { ContentBlock } from "@/src/types/course.types";
import FilterContentItem from "./filter-content-item";
import FilterTrigger from "./filter-trigger";

type Props = {
  column?: Column<ContentBlock, unknown>;
};

export default function ToolbarFilter({ column }: Props) {
  const [open, setOpen] = useState(false);
  const selectedValues = new Set(column?.getFilterValue() as string[]);
  const { t } = useTranslation("page");
  const blocks = contentBlockHandler.get.registeredContentBlocks();

  return (
    <Popover
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
      }}
    >
      <PopoverTrigger asChild>
        <FilterTrigger selectedValues={selectedValues} />
      </PopoverTrigger>
      <PopoverContent
        align="start"
        sideOffset={-2}
        className="max-w-[220px] space-y-2 !p-1"
      >
        {blocks.map((block) => (
          <FilterContentItem
            column={column}
            isSelected={selectedValues.has(block.type)}
            item={block}
            key={block.name}
            selectedValues={selectedValues}
          />
        ))}
        {!!selectedValues.size && (
          <>
            <Separator />
            <button
              className="w-full cursor-pointer px-2 !pb-1 text-left text-sm hover:opacity-80"
              onClick={() => {
                selectedValues.clear();
                column?.setFilterValue(undefined);
                setOpen(false);
              }}
            >
              {t("course_main_content_block_toolbar_filter_clear")}
            </button>
          </>
        )}
      </PopoverContent>
    </Popover>
  );
}
