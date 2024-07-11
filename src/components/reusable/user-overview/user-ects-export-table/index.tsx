import type { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  getCoursesForEctsExport,
  getDataForEctsExport,
} from "@/src/client-functions/client-ects";
import type { EctsExportData, ECTsTableItem } from "@/src/types/ects.types";
import type { InstitutionUserManagementUser } from "@/src/types/user-management.types";
import AsyncTable from "../../async-table";
import { Button } from "../../shadcn-ui/button";
import { Checkbox } from "../../shadcn-ui/checkbox";
import TruncateHover from "../../truncate-hover";
import ExportPreferencesPopover from "./export-preferences-popover";
import useECTsExport from "./zustand";

export default function UserEctsExportTable({
  user,
}: {
  user: InstitutionUserManagementUser;
}) {
  const { t } = useTranslation("page");
  const [data, setData] = useState<ECTsTableItem[]>([]);
  const {
    selectedCourseIds,
    setSelectedCourseIds,
    exportStructure,
    includeTimeConstrainingLayer,
  } = useECTsExport();
  const [loading, setLoading] = useState(false);
  const [exportData, setExportData] = useState<EctsExportData | null>(null);

  const refreshTrigger = exportStructure + includeTimeConstrainingLayer;

  const columns: ColumnDef<ECTsTableItem>[] = [
    {
      id: "name",
      accessorKey: "name",
      header: () => {
        return <div className="ml-1 flex items-center">{t("name")}</div>;
      },
      cell: ({ row }) => {
        if (row.original.isTitle) {
          // Render group titles
          return <div className="font-bold">{row.original.name}</div>;
        } else {
          // Render courses
          return (
            <div className="ml-1 flex items-center gap-2">
              {row.original.icon && <span>{row.original.icon}</span>}
              <TruncateHover text={row.original.name} truncateAt={25} />
            </div>
          );
        }
      },
    },
    {
      id: "timeConstrainingLayer",
      cell: ({ row }) => {
        if (row.original.isTitle) {
          return <></>;
        } else {
          return (
            <div className="ml-1 flex items-center gap-2">
              <TruncateHover
                text={row.original.timeConstrainingLayer || ""}
                truncateAt={15}
              />
            </div>
          );
        }
      },
    },
    {
      id: "select",
      header: () => (
        <div className="flex items-center justify-end">
          <Button
            size={"small"}
            variant={"ghost"}
            onClick={() => {
              if (selectedCourseIds.length < data.length) {
                setSelectedCourseIds(data.map((course) => course.layer_id));
              } else {
                setSelectedCourseIds([]);
              }
            }}
          >
            {t(
              selectedCourseIds.length < data.length || data.length === 0
                ? "select-all"
                : "deselect-all",
            )}
          </Button>
        </div>
      ),
      cell: ({ row }) =>
        row.original.isTitle ? null : (
          <div className="mr-4 flex items-center justify-end">
            <Checkbox
              checked={selectedCourseIds.includes(row.original.layer_id)}
              onCheckedChange={(value) => {
                if (value) {
                  setSelectedCourseIds([
                    ...selectedCourseIds,
                    row.original.layer_id,
                  ]);
                } else {
                  setSelectedCourseIds(
                    selectedCourseIds.filter(
                      (id) => id !== row.original.layer_id,
                    ),
                  );
                }
              }}
              aria-label="Select row"
            />
          </div>
        ),
      enableSorting: false,
      enableHiding: false,
    },
  ];

  async function fetchData(): Promise<ECTsTableItem[]> {
    const response = await getCoursesForEctsExport({
      userId: user.id,
      type: exportStructure,
      includeTimeConstrainingLayer,
    });
    if (!response) return [];

    setExportData({
      userId: user.id,
      ...response,
    });

    if (response.type === "flat") {
      return response.tableObjects as ECTsTableItem[];
    } else {
      // For grouped response, flatten the courses and include group names as titles.
      return response.tableObjectGroups.flatMap((group) => {
        return [{ name: group.name, isTitle: true }, ...group.tableObjects];
      }) as ECTsTableItem[];
    }
  }
  return (
    <div>
      <AsyncTable
        data={data}
        setData={setData}
        columns={columns}
        refreshTrigger={refreshTrigger}
        promise={fetchData}
        styleSettings={{
          height: 265,
          additionalComponent: (
            <div className="flex items-center gap-2">
              <ExportPreferencesPopover />
              <Button
                onClick={async () => {
                  if (!exportData) return;
                  setLoading(true);
                  await getDataForEctsExport(exportData, user.name, "pdf");
                  setLoading(false);
                }}
                disabled={
                  selectedCourseIds.length === 0 || !exportData || loading
                }
                variant={
                  selectedCourseIds.length > 0 || !exportData
                    ? "cta"
                    : "default"
                }
              >
                {t(loading ? "general.loading" : "export")}
              </Button>
            </div>
          ),
        }}
      />
    </div>
  );
}
