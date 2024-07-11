import { createColumnHelper } from "@tanstack/react-table";
import type { TFunction } from "i18next";
import { ArrowUpRight } from "lucide-react";
import contentBlockHandler from "@/src/client-functions/client-contentblock/handler";
import { isBlockOfType } from "@/src/client-functions/client-contentblock/utils";
import classNames from "@/src/client-functions/client-utils";
import TruncateHover from "@/src/components/reusable/truncate-hover";
import type { ContentBlockSpecsMapping } from "@/src/types/content-block/types/specs.types";
import type { ContentBlock } from "@/src/types/course.types";
import NewRequirements from "./block-new-requirements";
import BlockOptions from "./block-options";
import BlockStatus from "./block-status";

const columnHelper = createColumnHelper<ContentBlock>();

export const createContentBlockTableDef = (t: TFunction<"page", undefined>) => {
  return [
    columnHelper.accessor("name", {
      cell: (info) => {
        const blockType = contentBlockHandler.get.registeredContentBlockByType(
          info.row.original.type,
        );

        const isDividerBlock = isBlockOfType(info.row.original, "Section");
        if (isDividerBlock)
          return <div className="font-bold">{info.getValue()}</div>;

        return (
          <button
            onClick={() =>
              contentBlockHandler.zustand.openOverview(info.row.original.id)
            }
            className="w-full text-start underline-offset-2 hover:underline"
            disabled={!blockType.options?.hasUserOverview}
          >
            <div className="group flex w-full items-center justify-between">
              <TruncateHover
                className="text-contrast"
                side="right"
                text={info.getValue()}
                truncateAt={25}
              />
              <ArrowUpRight className="h-5 w-5 text-primary opacity-0 group-hover:opacity-100" />
            </div>
          </button>
        );
      },
      header: t("course_main_content_block_table_header_name"),
    }),
    columnHelper.accessor("type", {
      cell: (info) => {
        const blockType = contentBlockHandler.get.registeredContentBlockByType(
          info.cell.row.original.type,
        );

        if (blockType && blockType.type !== "Section") {
          const { icon } = blockType.style;
          return (
            <div className={classNames("flex items-center gap-2")}>
              <span className="text-muted-contrast">{icon}</span>
              <span>{t(blockType.name)}</span>
            </div>
          );
        }
      },
      filterFn: (row, id, blockTypes) => {
        const block = contentBlockHandler.get
          .registeredContentBlocks()
          .find((t) => t.type === row.getValue(id));

        return (
          !block ||
          (blockTypes as (keyof ContentBlockSpecsMapping)[]).includes(
            block.type,
          )
        );
      },
      header: t("course_main_content_block_table_header_type"),
    }),

    columnHelper.accessor("status", {
      cell: (info) => (
        <BlockStatus block={info.row.original} status={info.getValue()} />
      ),
      header: t("course_main_content_block_table_header_status"),
    }),
    columnHelper.display({
      id: "requirements",
      header: t("course_main_table_header_requirements"),
      cell: ({ row }) => <NewRequirements block={row.original} />,
    }),

    columnHelper.display({
      id: "actions",
      cell: ({ row }) => <BlockOptions block={row.original} />,
    }),
  ];
};
