import { useQueryClient } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import { ChevronDownIcon } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { getCoursesForEctsExport } from "@/src/client-functions/client-ects";
import AsyncTable from "@/src/components/reusable/async-table";
import { AutoLayerCourseIconDisplay } from "@/src/components/reusable/course-layer-icons";
import { Button } from "@/src/components/reusable/shadcn-ui/button";
import { Checkbox } from "@/src/components/reusable/shadcn-ui/checkbox";
import TruncateHover from "@/src/components/reusable/truncate-hover";
import WithToolTip from "@/src/components/reusable/with-tooltip";
import type { ECTsTableItem } from "@/src/types/ects.types";
import { useUserOverview } from "../../../zustand";
import ExportPreferencesPopover from "./export-preferences-popover";
import useECTsExport from "./zustand";

export default function UserEctsExportTable() {
  const { t } = useTranslation("page");
  const { user } = useUserOverview();
  const {
    selectedCourseIds,
    setSelectedCourseIds,
    exportStructure,
    includeTimeConstrainingLayer,
  } = useECTsExport();

  const [data, setData] = useState<ECTsTableItem[]>([]);
  const qc = useQueryClient();

  if (!user) return null;

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
              {row.original.icon && (
                <AutoLayerCourseIconDisplay
                  course={row.original}
                  height={20}
                  width={20}
                  className="text-xl"
                />
              )}
              <TruncateHover text={row.original.name} truncateAt={25} />
            </div>
          );
        }
      },
    },
    {
      id: "timeConstrainingLayer",
      cell: ({ row }) => {
        if (row.original.isTitle) return null;
        return (
          <div className="ml-1 flex items-center gap-2">
            <TruncateHover
              text={row.original.timeConstrainingLayer || ""}
              truncateAt={15}
            />
          </div>
        );
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
      cell: ({ row }) => {
        if (row.original.isTitle) return null;
        return (
          <div className="mr-4 flex items-center justify-end">
            <Checkbox
              checked={selectedCourseIds.includes(row.original.layer_id)}
              onCheckedChange={(value) => {
                // set selected courses here, the actual filtering of courses will happen inside `getDataForEctsExport`
                setSelectedCourseIds(
                  value
                    ? [...selectedCourseIds, row.original.layer_id]
                    : selectedCourseIds.filter(
                        (id) => id !== row.original.layer_id,
                      ),
                );
              }}
              aria-label="Select row"
            />
          </div>
        );
      },
      enableSorting: false,
      enableHiding: false,
    },
  ];

  async function fetchData() {
    if (!user) return [];

    const response = await qc.ensureQueryData({
      queryKey: ["export-data", exportStructure, user.id],
      queryFn: () =>
        getCoursesForEctsExport({
          userId: user.id,
          type: exportStructure,
          includeTimeConstrainingLayer,
        }),
    });

    if (!response) return [];

    if (response.type === "flat") {
      return response.tableObjects as ECTsTableItem[];
    } else {
      // For grouped response, flatten the courses and include group names as titles.
      return response.tableObjectGroups.flatMap((group) => {
        return [{ name: group.name, isTitle: true }, ...group.tableObjects];
      }) as ECTsTableItem[];
    }
  }
  const shouldDisablePopover = data.length === 0;
  return (
    <div>
      <AsyncTable
        data={data}
        setData={setData}
        columns={columns}
        refreshTrigger={refreshTrigger}
        promise={fetchData}
        styleSettings={{
          // height: 265,
          additionalComponent: shouldDisablePopover ? (
            <WithToolTip text={t("no_data_tooltip")} disabled={data.length > 0}>
              <Button className="gap-2" disabled>
                <span>{t("export")}</span>
                <ChevronDownIcon className="size-4" />
              </Button>
            </WithToolTip>
          ) : (
            <ExportPreferencesPopover forUserId={user.id}>
              <Button className="gap-2" disabled={shouldDisablePopover}>
                <span>{t("export")}</span>
                <ChevronDownIcon className="size-4" />
              </Button>
            </ExportPreferencesPopover>
          ),
        }}
      />
    </div>
  );
}
