import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { useTranslation } from "react-i18next";
import structureHandler from "@/src/client-functions/client-administration/structure-handler";
import { truncate } from "@/src/client-functions/client-utils";
import type { Layer } from "@/src/components/administration/types";
import AsyncTable from "@/src/components/reusable/async-table";
import { AutoLayerCourseIconDisplay } from "@/src/components/reusable/course-layer-icons";
import { EmptyState } from "@/src/components/reusable/empty-state";
import { Button } from "@/src/components/reusable/shadcn-ui/button";
import useAppointmentEditor from "../../zustand";
import AppointmentLayerSelector from "../appointment-layer-selector";
import LayerPopover from "./layer-popover";

export default function AppointmentLayerList() {
  const { layerIds } = useAppointmentEditor();
  const { t } = useTranslation("page");

  const columns: ColumnDef<Layer>[] = [
    {
      id: "name",
      accessorKey: "name",
      header: t("name"),
      cell: ({ row }) => {
        console.log(row.original.course);
        return (
          <p className="flex w-full items-center gap-2">
            <AutoLayerCourseIconDisplay
              course={row.original.course || null}
              height={20}
              width={20}
              className="h-5 w-5"
            />
            <span> {truncate(row.original.name, 30)}</span>
          </p>
        );
      },
    },
    {
      id: "menu",
      accessorKey: "menu",
      header: () => (
        <div className="flex items-center justify-end">
          <AppointmentLayerSelector />
        </div>
      ),
      cell: ({ row }) => (
        <div className="flex items-center justify-end">
          <LayerPopover row={row}>
            <Button size={"iconSm"} variant={"ghost"} className="mr-1">
              <MoreHorizontal className="h-4 w-4 text-muted-contrast" />
            </Button>
          </LayerPopover>
        </div>
      ),
    },
  ];

  return (
    <AsyncTable
      promise={() => structureHandler.get.layers(layerIds)}
      columns={columns as any}
      refreshTrigger={layerIds}
      styleSettings={{
        emptyState: (
          <EmptyState
            title="event.localization.empty.title"
            description="event.localization.empty.description"
          />
        ),
        showSearchBar: false,
        pagination: false,
      }}
    />
  );
}
