import dayjs from "dayjs";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import type { AppointmentAttendanceUserLog } from "@/src/pages/api/schedule/attendence/get-attendance-logs-of-user";
import type { InstitutionUserManagementUser } from "@/src/types/user-management.types";
import useUser from "@/src/zustand/user";
import ExportCsvButton from "../csv-export-button/export-button";
import type { UserCSVData } from "../csv-export-button/export-user-data";
import { UserAttendanceTable } from "../user-attendance-table";

type UserAttendanceTableDataToExportProps = {
  name: string;
  date: string;
  time: string;
  role: string;
};

type UserInfos = UserCSVData<UserAttendanceTableDataToExportProps>;

export default function UserAttendanceView({
  user,
}: {
  user?: InstitutionUserManagementUser;
}) {
  const { t } = useTranslation("page");
  const [data, setData] = useState<AppointmentAttendanceUserLog[]>([]);
  const { user: userData } = useUser();
  const attendant = user ? user : userData;

  function getAttendanceUserDataForExport(): UserInfos[] {
    return data.map((attendanceLog) => {
      const startTime = dayjs(attendanceLog.dateTime).format("HH:mm");
      const duration = attendanceLog.duration;

      const attendanceUserData: UserInfos = {
        username: attendant.name,
        date: dayjs(attendanceLog.dateTime).format("YYYY-MM-DD"),
        name: attendanceLog.name,
        role: attendanceLog.isOrganizer
          ? t("organizer")
          : attendanceLog.isMember
          ? t("member")
          : t("special_access"),

        time: `${startTime} (${duration} min)`,
      };
      const attendanceUserDataWithTranslatedObjectKeys = {
        [t("username")]: attendanceUserData.username,
        [t("csv.table.headers.date")]: attendanceUserData.date,
        [t("csv.table.headers.name")]: attendanceUserData.name,
        [t("csv.table.headers.role")]: attendanceUserData.role,
        [t("csv.table.headers.time")]: attendanceUserData.time,
      } as UserInfos;

      return attendanceUserDataWithTranslatedObjectKeys;
    });
  }

  return (
    <UserAttendanceTable
      data={data}
      setData={setData}
      user={user ?? null}
      additionalComponent={
        <ExportCsvButton
          data={getAttendanceUserDataForExport()}
          fileBaseName={"attendance-user"}
          fileSuffixName={attendant.name}
        />
      }
      viewMode={"overview"}
    />
  );
}
