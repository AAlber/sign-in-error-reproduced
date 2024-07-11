import type { RatingSchema } from "@prisma/client";
import type { ColumnDef } from "@tanstack/react-table";
import { Table } from "lucide-react";
import { useTranslation } from "react-i18next";
import { getRatingSchemas } from "@/src/client-functions/client-rating-schema";
import { truncate } from "@/src/client-functions/client-utils";
import AsyncTable from "@/src/components/reusable/async-table";
import { EmptyState } from "@/src/components/reusable/empty-state";
import SettingsSection from "../../../reusable/settings/settings-section";
import RatingSchemaCreateButton from "./rating-schema-create-btn";
import RatingSchemaMenu from "./rating-schema-menu";
import useRatingSchemaTable from "./zustand";

export default function RatingSchemaTable() {
  const { t } = useTranslation("page");
  const { schemas, setSchemas } = useRatingSchemaTable();

  async function fetchRatingSchemas() {
    const schemes = await getRatingSchemas();
    if (schemes) {
      // setSchemas(schemes);
      return schemes;
    } else return [];
  }

  const columns: ColumnDef<RatingSchema>[] = [
    {
      id: "name",
      accessorKey: "name",
      header: t("name"),
      cell: ({ row }) => (
        <p className="flex w-full items-center gap-2">
          <span> {truncate(row.original.name, 30)}</span>{" "}
          <span className="text-muted-contrast">
            {truncate(
              row.original.default ? t("rating_schema.default") : "",
              30,
            )}
          </span>
        </p>
      ),
    },
    {
      id: "menu",
      cell: ({ row }) => (
        <div className="flex items-center justify-end">
          <RatingSchemaMenu schema={row.original} />
        </div>
      ),
    },
  ];

  return (
    <SettingsSection
      title="rating_schema.title"
      subtitle="rating_schema.description"
      noFooter
    >
      <AsyncTable<RatingSchema>
        promise={fetchRatingSchemas}
        data={schemas}
        setData={setSchemas}
        columns={columns}
        styleSettings={{
          emptyState: (
            <EmptyState
              icon={Table}
              title="grading.schemas.empty.title"
              description="grading.schemas.empty.description"
            >
              <EmptyState.Article articleId={8703730} />
            </EmptyState>
          ),
          rowsPerPage: 5,
          additionalComponent: <RatingSchemaCreateButton />,
        }}
      />
    </SettingsSection>
  );
}
