import { useTranslation } from "react-i18next";
import classNames from "@/src/client-functions/client-utils";
import {
  HoverCard,
  HoverCardSheet,
  HoverCardTrigger,
} from "@/src/components/reusable/shadcn-ui/hover-card";

export default function AttendenceDisplay({
  courseMember,
}: {
  courseMember: CourseMember;
}) {
  const { t } = useTranslation("page");

  return (
    <HoverCard>
      <HoverCardTrigger>
        <div
          className={classNames(
            "flex items-center gap-2",
            courseMember.attendanceStatus.isRateSufficient
              ? "text-positive"
              : "text-muted-contrast",
          )}
        >
          <div className="flex h-1.5 w-24 items-center justify-start rounded-full border border-border bg-muted">
            <div
              style={{ width: courseMember.attendanceStatus.percentage + "%" }}
              className={classNames(
                "h-full rounded-full",
                courseMember.attendanceStatus.isRateSufficient
                  ? "bg-positive"
                  : "bg-destructive",
              )}
            ></div>
          </div>
          <p className="max-lg:hidden">
            {courseMember.attendanceStatus.attendedAppointmentsCount} /
            {courseMember.attendanceStatus.totalAppointmentsCount}
          </p>
        </div>
      </HoverCardTrigger>
      <HoverCardSheet>
        <div className="grid grid-cols-2 gap-1">
          <h4 className="text-muted-contrast">{t("attendance_rate")}:</h4>
          <span
            className={`text-end font-bold ${
              courseMember.attendanceStatus.isRateSufficient
                ? "text-positive"
                : "text-destructive"
            }`}
          >
            {courseMember.attendanceStatus.percentage}%
          </span>
          <h4 className="text-muted-contrast">{t("attendance_events")}:</h4>
          <span className="text-end font-bold text-contrast">
            {courseMember.attendanceStatus.attendedAppointmentsCount}
          </span>
          <h4 className="text-muted-contrast">{t("attendance_upcoming")}:</h4>
          <span className="text-end font-bold text-contrast">
            {courseMember.attendanceStatus.appointmentsInFutureCount}
          </span>
          <h4 className="text-muted-contrast">{t("attendance_total")}:</h4>
          <span className="text-end font-bold text-contrast">
            {courseMember.attendanceStatus.totalAppointmentsCount}
          </span>
        </div>
      </HoverCardSheet>
    </HoverCard>
  );
}
