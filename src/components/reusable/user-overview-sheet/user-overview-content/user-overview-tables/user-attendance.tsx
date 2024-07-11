import { useState } from "react";
import { useTranslation } from "react-i18next";
import { UserAttendanceTable } from "@/src/components/reusable/user-attendance-table";
import { exportUserAttendanceData } from "@/src/components/reusable/user-attendance-table/function";
import type { AppointmentAttendanceUserLog } from "@/src/pages/api/schedule/attendence/get-attendance-logs-of-user";
import useUser from "@/src/zustand/user";
import { Button } from "../../../shadcn-ui/button";
import WithToolTip from "../../../with-tooltip";
import { useUserOverview } from "../../zustand";

export default function UserAttendanceView() {
  const { t } = useTranslation("page");
  const [data, setData] = useState<AppointmentAttendanceUserLog[]>([]);
  const { user: userData } = useUser();
  const { user } = useUserOverview();
  const attendant = user ? user : userData;

  return (
    <UserAttendanceTable
      data={data}
      setData={setData}
      user={user}
      additionalComponent={
        <WithToolTip text={t("no_data_tooltip")} disabled={data.length > 0}>
          <Button
            variant={"cta"}
            onClick={() => exportUserAttendanceData(attendant, data)}
            disabled={data.length === 0}
          >
            {t("export")}
          </Button>
        </WithToolTip>
      }
      viewMode={"edit"}
    />
  );
}
