import type { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";
import { Edit, Eye } from "lucide-react";
import { memo, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { updateAttendenceOfUser } from "@/src/client-functions/client-appointment-attendence";
import AsyncTable from "@/src/components/reusable/async-table";
import { Checkbox } from "@/src/components/reusable/shadcn-ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/src/components/reusable/shadcn-ui/popover";
import TruncateHover from "@/src/components/reusable/truncate-hover";
import type { AppointmentAttendanceUserLog } from "@/src/pages/api/schedule/attendence/get-attendance-logs-of-user";
import type { InstitutionUserManagementUser } from "@/src/types/user-management.types";

const UserAttendanceEditPopover = memo(
  ({
    item,
    data,
    setData,
    user,
    viewMode,
    isOpen,
    setIsOpen,
  }: {
    item: AppointmentAttendanceUserLog;
    data: AppointmentAttendanceUserLog[];
    setData: React.Dispatch<
      React.SetStateAction<AppointmentAttendanceUserLog[]>
    >;
    user: InstitutionUserManagementUser | null;
    viewMode?: "overview" | "edit";
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
  }) => {
    const { t } = useTranslation("page");

    const [appointments, setAppointments] = useState<
      AppointmentAttendanceUserLog[]
    >(data.filter((log) => log.layerId === item.layerId));

    const columns: ColumnDef<AppointmentAttendanceUserLog>[] = useMemo(
      () => [
        {
          id: "date",
          accessorKey: "date",
          header: t("date"),
          cell: ({ row }) => {
            return (
              <div className="flex items-center gap-2">
                {dayjs(row.original.dateTime).format("DD.MM.YY")}
              </div>
            );
          },
        },
        {
          id: "name",
          accessorKey: "name",
          header: t("name"),
          cell: ({ row }) => {
            return (
              <div className="flex items-center gap-2">
                <TruncateHover text={row.original.name} truncateAt={30} />
              </div>
            );
          },
        },
        {
          id: "x",
          accessorKey: "x",
          header: t("role"),
          cell: ({ row }) => {
            return (
              <div className="flex items-center gap-2">
                {row.original.isOrganizer
                  ? t("organizer")
                  : row.original.isMember
                  ? t("member")
                  : t("special_access")}
              </div>
            );
          },
        },
        {
          id: "time",
          accessorKey: "time",
          header: t("time"),
          cell: ({ row }) => {
            return (
              <div className="flex items-center gap-2">
                {dayjs(row.original.dateTime).format("HH:mm")} (
                {row.original.duration} {t("min")})
              </div>
            );
          },
        },
        {
          id: "attended",
          accessorKey: "attended",
          header: () => {
            if (!user) return null;
            return (
              <div className="flex h-5 items-center justify-end gap-2">
                {t("attended")}
              </div>
            );
          },
          cell: ({ row }) => {
            if (!user) return null;
            if (row.original.isOrganizer) return null;
            if (!row.original.isMember) return null;

            return (
              <div className="mr-4 flex h-5 items-center justify-end">
                <Checkbox
                  variant={"positive"}
                  checked={row.original.attended}
                  onCheckedChange={() => {
                    setAppointments(
                      appointments.map((log) => {
                        if (log.id === row.original.id) {
                          return {
                            ...log,
                            attended: !log.attended,
                          };
                        }
                        return log;
                      }),
                    );
                    // set the global data only with the new data and keep the old data
                    setData(
                      data.map((log) => {
                        if (log.id === row.original.id) {
                          return {
                            ...log,
                            attended: !log.attended,
                          };
                        }
                        return log;
                      }),
                    );
                    updateAttendenceOfUser(
                      row.original.id,
                      user.id,
                      !row.original.attended,
                    );
                  }}
                />
              </div>
            );
          },
        },
      ],
      [appointments, data, setData, t, user],
    );

    return (
      <Popover modal open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger className="ml-auto mr-2 justify-end" asChild>
          {viewMode === "edit" ? (
            <Edit className="size-4 cursor-pointer text-muted-contrast" />
          ) : (
            <Eye className="size-4 cursor-pointer text-muted-contrast" />
          )}
        </PopoverTrigger>
        <PopoverContent className="relative size-auto">
          <AsyncTable
            columns={columns}
            data={appointments}
            promise={() => Promise.resolve(appointments)}
            styleSettings={{
              pagination: appointments.length > 20,
              showSearchBar: false,
              rowsPerPage: appointments.length > 20 ? 10 : appointments.length,
            }}
          />
        </PopoverContent>
      </Popover>
    );
  },
);

UserAttendanceEditPopover.displayName = "UserAttendanceEditPopover";

export default UserAttendanceEditPopover;
