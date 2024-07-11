import type { RatingSchemaValue } from "@prisma/client";
import type { ColumnDef } from "@tanstack/react-table";
import { useTranslation } from "react-i18next";
import { getRatingSchemaValues } from "@/src/client-functions/client-rating-schema";
import { truncate } from "@/src/client-functions/client-utils";
import AsyncTable from "@/src/components/reusable/async-table";
import Modal from "@/src/components/reusable/modal";
import RatingSchemaAddValueButton from "./rating-schema-add-value";
import RatingSchemaPassPercentageSlider from "./rating-schema-pass-percentage-slider";
import RatingSchemaRename from "./rating-schema-rename";
import RatingSchemaValueMenu from "./rating-schema-value-menu";
import useRatingSchemaSettings from "./zustand";

export default function RatingSchemaSettings() {
  const { open, schema, values, setValues, setOpen } =
    useRatingSchemaSettings();
  const { t } = useTranslation("page");

  async function fetchRatingSchemaValuesAndUpdateZustand() {
    if (!schema) return [];
    const values = await getRatingSchemaValues({ ratingSchemaId: schema.id });
    if (values) {
      setValues(values);
      return values;
    } else return [];
  }

  if (!schema) return null;

  const columns: ColumnDef<RatingSchemaValue>[] = [
    {
      id: "label",
      accessorKey: "label",
      header: t("label"),
      cell: ({ row }) => (
        <p className="flex w-full items-center gap-2">
          <span> {truncate(row.original.name, 30)}</span>{" "}
        </p>
      ),
    },
    {
      id: "min",
      accessorKey: "min",
      header: t("rating_schema.range.min"),
      cell: ({ row }) => (
        <p className="flex w-full items-center gap-2 text-muted-contrast">
          <span>{row.original.min}%</span>{" "}
        </p>
      ),
    },
    {
      id: "max",
      accessorKey: "max",
      header: t("rating_schema.range.max"),
      cell: ({ row }) => (
        <p className="flex w-full items-center gap-2 text-muted-contrast">
          <span>{row.original.max}%</span>{" "}
        </p>
      ),
    },
    {
      id: "menu",
      accessorKey: "menu",
      header: () => (
        <div className="flex items-center justify-end">
          <RatingSchemaAddValueButton />
        </div>
      ),
      cell: ({ row }) => (
        <p className="flex w-full items-center justify-end gap-2 text-muted-contrast">
          <RatingSchemaValueMenu value={row.original} />
        </p>
      ),
    },
  ];

  return (
    <Modal open={open} setOpen={setOpen}>
      <div className="flex w-full flex-col gap-4 text-center sm:text-left">
        <div>
          <h2 className="flex items-center gap-2 text-lg font-medium text-contrast">
            {schema.name}
            <RatingSchemaRename schema={schema} />
          </h2>
          <p className="text-sm text-muted-contrast">
            {t("rating_schema.settings.description")}
          </p>
        </div>
        <RatingSchemaPassPercentageSlider schema={schema} />
        <AsyncTable<RatingSchemaValue>
          promise={fetchRatingSchemaValuesAndUpdateZustand}
          data={values}
          setData={setValues}
          columns={columns}
          styleSettings={{
            rowsPerPage: 10,
            showSearchBar: false,
          }}
        />
      </div>
    </Modal>
  );
}
