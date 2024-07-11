import type { Column } from "@tanstack/react-table";
import { CheckIcon } from "lucide-react";
import React from "react";
import { useTranslation } from "react-i18next";
import classNames from "@/src/client-functions/client-utils";
import type { RegisteredContentBlock } from "@/src/types/content-block/types/cb-types";
import type { ContentBlock } from "@/src/types/course.types";

type Props = {
  selectedValues: Set<string>;
  isSelected: boolean;
  item: RegisteredContentBlock;
  column: Column<ContentBlock, unknown> | undefined;
};

export default function FilterContentItem({
  column,
  item,
  selectedValues,
  isSelected,
}: Props) {
  const { t } = useTranslation("page");
  return (
    <button
      className="flex w-full cursor-pointer items-center space-x-1 rounded-md px-2 py-1 text-sm hover:bg-secondary"
      onClick={() => {
        if (isSelected) selectedValues.delete(item.type);
        else selectedValues.add(item.type);

        const filterValues = Array.from(selectedValues);
        column?.setFilterValue(filterValues.length ? filterValues : undefined);
      }}
    >
      <div
        className={classNames(
          "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
          isSelected
            ? "text-primary-foreground bg-primary"
            : "opacity-50 [&_svg]:invisible",
        )}
      >
        <CheckIcon className={classNames("h-4 w-4")} />
      </div>
      <span>{t(item.name)}</span>
    </button>
  );
}
