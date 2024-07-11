import type { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";
import { HelpCircle, QrCode } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { getUserAppointmentAttendanceDataForExport } from "@/src/client-functions/client-appointment";
import {
  getAllAttendenceLogsFromAppointment,
  type MemberWithAttendence,
} from "@/src/client-functions/client-appointment-attendence";
import { truncate } from "@/src/client-functions/client-utils";
import AsyncTable from "../../reusable/async-table";
import ExportCsvButton from "../../reusable/csv-export-button/export-button";
import Modal from "../../reusable/modal";
import { Button } from "../../reusable/shadcn-ui/button";
import WithToolTip from "../../reusable/with-tooltip";
import UserDefaultImage from "../../user-default-image";
import useAppointmentCheckInModal from "../appointment-check-in/zustand";
import UserAttendenceCheck from "./attended-check";
import { AttendenceSaveButton } from "./attendence-save-button";
import { countAttendedMembers } from "./functions";
import { TableAttendedCheck } from "./table-attended-check";
import useAppointmentAttendenceModal from "./zustand";

export default function AppointmentAttendenceModal() {
  const { init } = useAppointmentCheckInModal();
  const {
    open,
    appointment,
    setOpen,
    dataToUpdate,
    refresh,
    setCountedMembers,
  } = useAppointmentAttendenceModal();
  const { t } = useTranslation("page");
  const [data, setData] = useState<MemberWithAttendence[]>([]);

  useEffect(() => {
    const attendedCount = countAttendedMembers(data, dataToUpdate);
    setCountedMembers(attendedCount);
  }, [data, dataToUpdate]);

  const columns: ColumnDef<MemberWithAttendence>[] = [
    {
      id: "name",
      accessorKey: "name",
      header: t("name"),
      cell: ({ row }) => (
        <div className="flex w-full items-center gap-4">
          <UserDefaultImage user={row.original} dimensions={"h-6 w-6"} />
          {truncate(row.original.name, 30)}
        </div>
      ),
    },
    {
      id: "firstAttendedAt",
      accessorKey: "firstAttendedAt",
      header: () => (
        <div className="mr-3 flex items-center justify-end gap-1">
          {t("first_attended_timestamp")}
          <WithToolTip text={t("appointments_attendance_table_tooltip")}>
            <HelpCircle className="h-4 w-4" />
          </WithToolTip>
        </div>
      ),
      cell: ({ row }) => (
        <span className="mr-4 flex h-5 items-center justify-end">
          {row.original.firstAttendedAt
            ? dayjs(row.original.firstAttendedAt).format("DD. MMM HH:mm")
            : ""}
        </span>
      ),
    },

    {
      id: "menu",
      header: () => <TableAttendedCheck data={data} />,
      cell: ({ row }) => (
        <div className="mr-4 flex h-5 items-center justify-end">
          <UserAttendenceCheck
            member={row.original}
            membersWithAttendance={data}
          />
        </div>
      ),
    },
  ];

  if (!appointment) return null;

  return (
    <Modal open={open} setOpen={setOpen} size="lg">
      <div className="flex flex-col gap-4">
        <div className="text-center sm:text-left">
          <h3 className="t-primary text-lg font-medium leading-6">
            {t("attendence.title")}
          </h3>
          <p className="text-sm text-muted-contrast">
            {t("attendence.description")}
          </p>
        </div>

        <AsyncTable<MemberWithAttendence>
          promise={() => getAllAttendenceLogsFromAppointment(appointment.id)}
          columns={columns}
          data={data}
          setData={setData}
          refreshTrigger={refresh}
          styleSettings={{
            additionalComponent: (
              <div className="flex w-full items-center justify-end gap-2">
                {!appointment.isOnline && (
                  <Button
                    onClick={async () => init(appointment)}
                    className="flex items-center gap-2"
                  >
                    {<QrCode className="mr-1 h-4 w-4 " />}
                    {t("attendence.qr_checkin")}
                  </Button>
                )}
                <ExportCsvButton
                  data={data.map((member) =>
                    getUserAppointmentAttendanceDataForExport(member, t),
                  )}
                  fileBaseName="attendance"
                  fileSuffixName={appointment.title}
                />
                {dataToUpdate.length > 0 && (
                  <AttendenceSaveButton data={data} setData={setData} />
                )}
              </div>
            ),
          }}
        />
      </div>
    </Modal>
  );
}
