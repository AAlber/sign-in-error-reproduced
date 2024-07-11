import type { Table } from "@tanstack/react-table";
import { X } from "lucide-react";
import React from "react";
import { useTranslation } from "react-i18next";
import classNames from "@/src/client-functions/client-utils";
import { Input } from "@/src/components/reusable/shadcn-ui/input";
import type { ContentBlock } from "@/src/types/course.types";

type Props = {
  table: Table<ContentBlock>;
};

export default function ToolbarSearch({ table }: Props) {
  const filterValue =
    (table.getColumn("name")?.getFilterValue() as string) ?? "";
  const { t } = useTranslation("page");
  return (
    <div className="relative flex items-center lg:w-[400px]">
      <Input
        className="pr-8"
        placeholder={t("course_toolbar_search")}
        value={filterValue}
        onChange={(event) =>
          table.getColumn("name")?.setFilterValue(event.target.value)
        }
      />
      <button
        className={classNames(
          !filterValue && "hidden",
          "absolute right-2 mt-0.5 text-muted hover:text-contrast",
        )}
        onClick={() => {
          table.getColumn("name")?.setFilterValue(undefined);
        }}
      >
        <X size={16} />
      </button>
    </div>
  );
}
