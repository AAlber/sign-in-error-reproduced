import { t } from "i18next";
import classNames from "@/src/client-functions/client-utils";
import {
  HoverCard,
  HoverCardSheet,
  HoverCardTrigger,
} from "@/src/components/reusable/shadcn-ui/hover-card";
import type { AppointmentAttendanceUserLog } from "@/src/pages/api/schedule/attendence/get-attendance-logs-of-user";

export const UserAttendanceOverview = ({
  item,
  data,
}: {
  item: AppointmentAttendanceUserLog;
  data: AppointmentAttendanceUserLog[];
}) => {
  const totalAppointments = data.filter(
    (log) => log.layerId === item.layerId,
  ).length;

  const attendedAppointments = data.filter(
    (log) => log.layerId === item.layerId && log.attended,
  ).length;

  const attendedPercentage = Math.round(
    (attendedAppointments / totalAppointments) * 100,
  );

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <div className="flex w-min items-center gap-2">
          <div className="flex h-1.5 w-24 items-center justify-start rounded-full border border-border bg-muted">
            <div
              style={{ width: attendedPercentage + "%" }}
              className={classNames(
                "h-full rounded-full",
                totalAppointments > 0 ? "bg-positive" : "bg-destructive",
              )}
            ></div>
          </div>
          <p className="w-max">
            {attendedAppointments} / {totalAppointments}
          </p>
        </div>
      </HoverCardTrigger>
      <HoverCardSheet side="right" align="center">
        <div className="grid grid-cols-2 gap-1">
          <h4 className="text-muted-contrast">{t("attendance_rate")}:</h4>
          <span
            className={`text-end font-bold ${
              attendedPercentage >= 75 ? "text-positive" : "text-destructive"
            }`}
          >
            {attendedPercentage}%
          </span>
          <h4 className="text-muted-contrast">{t("attendance_events")}:</h4>
          <span className="text-end font-bold text-contrast">
            {attendedAppointments}
          </span>
          <h4 className="text-muted-contrast">{t("attendance_upcoming")}:</h4>
          <span className="text-end font-bold text-contrast">
            {totalAppointments - attendedAppointments}
          </span>
          <h4 className="text-muted-contrast">{t("attendance_total")}:</h4>
          <span className="text-end font-bold text-contrast">
            {totalAppointments}
          </span>
        </div>
      </HoverCardSheet>
    </HoverCard>
  );
};
