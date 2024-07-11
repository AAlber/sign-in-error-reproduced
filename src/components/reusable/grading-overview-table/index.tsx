import type { ColumnDef } from "@tanstack/react-table";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  getGradesOfSpecificUser,
  getUserGrades,
} from "@/src/client-functions/client-user";
import type { UserGrade } from "@/src/types/user.types";
import AsyncTable from "../async-table";

type Props = { userId?: string; layerId?: string };

/**
 * Displays a table of grading overviews.
 *
 * @param {Object} props - Component props.
 * @param {string} [props.userId] - User ID to fetch grades, mandatory for special roles (to get member's grades). Leave undefined for self.
 * @param {string} [props.layerId] - Optional. Filters grades by layer. Defaults to all layers if undefined.
 */
const GradingOverviewTable = ({ userId, layerId }: Props) => {
  const { t } = useTranslation("page");
  const [data, setData] = useState<UserGrade[]>();

  const handleGetGrades = async () => {
    if (!userId) {
      return await getUserGrades(layerId);
    }
    return await getGradesOfSpecificUser(userId, layerId);
  };

  const columns: ColumnDef<UserGrade>[] = [
    // Show layer name if layerId is undefined
    // since it fetches grades from all layers.
    ...(layerId === undefined
      ? [
          {
            id: "layer_name",
            accessorKey: "layer_name",
            header: `${t(
              "admin_dashboard.table_header_create_course_button",
            )} / 
      ${t("admin_dashboard.table_header_create_layer_button")}`,
            cell: ({ row }) => (
              <div className="flex w-full items-center gap-4">
                <p>{row.original.layerName}</p>
              </div>
            ),
          },
        ]
      : []),
    {
      id: "name",
      accessorKey: "name",
      header: t("name"),
      cell: ({ row }) => (
        <div className="flex w-full items-center gap-4">
          <p>{row.original.name}</p>
        </div>
      ),
    },
    {
      id: "grade",
      accessorKey: "grade",
      header: t("grade"),
      cell: ({ row }) => (
        <div className="flex w-full items-center gap-4">
          <p>{row.original.grade}</p>
        </div>
      ),
    },
  ];

  return (
    <AsyncTable
      columns={columns}
      promise={handleGetGrades}
      data={data}
      setData={setData}
    />
  );
};

export default GradingOverviewTable;
