import type { TFunction } from "i18next";
import type { UserCSVData } from "@/src/components/reusable/csv-export-button/export-user-data";
import { log } from "@/src/utils/logger/logger";

type UserCourseDataToExportProps = {
  attendance: string;
  prerequisites: string;
  status: string;
};

type UserInfos = UserCSVData<UserCourseDataToExportProps>;

function getCourseUserDataForExport(
  courseMember: CourseMember,
  t: TFunction,
): UserInfos {
  const passedGoals = courseMember.prerequisitesStatus.filter(
    (goal) => goal.status === "passed",
  ).length;
  const totalGoals = courseMember.prerequisitesStatus.length;
  const allGoalsPassed = passedGoals === totalGoals;
  const automaticPassed =
    courseMember.attendanceStatus.isRateSufficient && allGoalsPassed;
  const passed = courseMember.overwrittenStatus
    ? courseMember.overwrittenStatus.passed
    : automaticPassed;

  const courseUserData: UserInfos = {
    username: courseMember.name,
    attendance: `${courseMember.attendanceStatus.attendedAppointmentsCount} / ${courseMember.attendanceStatus.totalAppointmentsCount}`,
    prerequisites: allGoalsPassed ? t("PASSED") : t("FAILED"),
    status: passed ? t("PASSED") : t("FAILED"),
  };
  const courseUserDataWithTranslatedObjectKeys = {
    [t("csv.table.headers.fullname")]: courseUserData.username,
    [t("csv.table.headers.attendance")]: courseUserData.attendance,
    [t("csv.table.headers.prerequisites")]: courseUserData.prerequisites,
    [t("csv.table.headers.status")]: courseUserData.status,
  } as UserInfos;

  log.info("Exporting course user data", {
    courseUserData,
  });

  return courseUserDataWithTranslatedObjectKeys;
}

export default getCourseUserDataForExport;
