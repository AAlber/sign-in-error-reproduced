import type { ColumnDef } from "@tanstack/react-table";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { getAttendanceLogsOfUser } from "@/src/client-functions/client-appointment-attendence";
import { AutoLayerCourseIconDisplay } from "@/src/components/reusable/course-layer-icons";
import type { AppointmentAttendanceUserLog } from "@/src/pages/api/schedule/attendence/get-attendance-logs-of-user";
import type { InstitutionUserManagementUser } from "@/src/types/user-management.types";
import AsyncTable from "../async-table";
import TruncateHover from "../truncate-hover";
import { UserAttendanceOverview } from "./attendance-overview";
import UserAttendanceEditPopover from "./view-edit-attendance-popover";

interface UserAttendanceTableProps {
  user: InstitutionUserManagementUser | null;
  additionalComponent?: React.ReactNode;
  viewMode: "overview" | "edit";
  data: AppointmentAttendanceUserLog[];
  setData: React.Dispatch<React.SetStateAction<AppointmentAttendanceUserLog[]>>;
}

export function UserAttendanceTable({
  user,
  additionalComponent,
  viewMode,
  data,
  setData,
}: UserAttendanceTableProps) {
  const { t } = useTranslation("page");

  const [openPopoverId, setOpenPopoverId] = useState<string | null>(null);

  const handlePopoverOpenChange = useCallback((isOpen: boolean, id: string) => {
    if (isOpen) {
      setOpenPopoverId(id);
    } else {
      setOpenPopoverId(null);
    }
  }, []);

  const columns: ColumnDef<AppointmentAttendanceUserLog>[] = [
    {
      id: "name",
      accessorKey: "name",
      header: t("name"),
      cell: ({ row }) => {
        return (
          <div className="flex gap-2">
            <AutoLayerCourseIconDisplay
              course={row.original.course}
              className="size-5"
            />
            <TruncateHover text={row.original.layerName} truncateAt={30} />
          </div>
        );
      },
    },
    {
      id: "attendance",
      accessorKey: "attendance",
      header: t("attendance"),
      cell: ({ row }) => (
        <UserAttendanceOverview item={row.original} data={data} />
      ),
    },
    {
      id: "edit",
      accessorKey: "edit",
      header: "",
      cell: ({ row }) => {
        return (
          <UserAttendanceEditPopover
            item={row.original}
            data={data}
            setData={setData}
            viewMode={viewMode}
            user={user}
            isOpen={openPopoverId === row.original.id}
            setIsOpen={(isOpen) =>
              handlePopoverOpenChange(isOpen, row.original.id)
            }
          />
        );
      },
    },
  ];

  return (
    <AsyncTable
      promise={() => getAttendanceLogsOfUser(!user ? undefined : user.id)}
      columns={columns}
      data={data.filter(
        (log, index, self) =>
          index === self.findIndex((t) => t.layerId === log.layerId),
      )}
      setData={setData}
      styleSettings={{
        additionalComponent: additionalComponent,
      }}
    />
  );
}
