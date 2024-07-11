import type {
  CourseWithDurationAndProgress,
  MemberCourseStatus,
} from "@/src/types/user.types";
import { prisma } from "../../db/client";
import { getLayer } from "../server-administration";
import { getPublishContentBlocksOfLayer } from "../server-content-block";
import {
  countFutureAppointmentsOfLayer,
  getContentBlockFinishedPercentage as getContentBlockFinished,
  getCourseGoalByLayerId,
  getCourseGoalContentBlocksByLayerId,
  getSimpleAttendancePercentageForLayer,
} from "../server-course-goals";
import { getOverwrittenUserStatuses } from "../server-course-overwritten-user-status";
import { getCoursesUserHasAccessTo } from "../server-user";

/** gets course with userProgress data which we then feed to Course-Grid component
 * the return data will depend on the requesting user's role
 */
export async function getUserCoursesWithProgressData(userId: string) {
  const courses = await getCoursesUserHasAccessTo(userId);
  const promises = courses.map(async (course) => {
    const userProgress =
      course.role === "member"
        ? await getCourseStatusForMember(userId, course.layer_id)
        : undefined;
    return { ...course, userProgress } as CourseWithDurationAndProgress;
  });

  return await Promise.all(promises);
}

/************ FOR REGULAR MEMBERS OF COURSE ************/

export async function getCourseStatusForMember(
  userId: string,
  layerId: string,
): Promise<MemberCourseStatus> {
  /**
   * STEPS:
   * 1. get all published contentBlocks of a course and check if the block is finished or not started
   * 2. get user's attendance rate
   * 3. check if courseGoals are met:
   *    - blockGoals passed - get userGrading of these blocks
   *    - minimum attendance met
   * 4. check if there are any overwrittenStatus - if overwrittenStatus.passed == true shortCircuit to passed course
   * 5. evaluate userStatus
   */
  const [
    layer,
    contentblocks,
    attendancePercentage,
    futureAppointmentsCount,
    courseGoal,
    courseGoalBlocks,
  ] = await Promise.all([
    getLayer(layerId),
    getPublishContentBlocksOfLayer(layerId),
    getSimpleAttendancePercentageForLayer(layerId, userId),
    countFutureAppointmentsOfLayer(layerId),
    getCourseGoalByLayerId({ layerId }),
    getCourseGoalContentBlocksByLayerId({
      layerId,
      onlyIds: true,
    }),
  ]);

  const [contentBlocksFinished, goalBlocksUserGrading] = await Promise.all([
    getContentBlockFinished(userId, contentblocks),
    !!courseGoalBlocks.length
      ? // get gradings of the required courseGoal contentBlocks
        await prisma.contentBlockUserGrading.findMany({
          where: { blockId: { in: courseGoalBlocks.map((i) => i.id) }, userId },
        })
      : Promise.resolve([]),
  ]);

  // if any of the required courseGoal contentBlocks is failed, then student automatically fails the course
  const hasFailedARequiredBlock = goalBlocksUserGrading.some((b) => !b.passed);
  const hasPassedAllRequiredBlocks =
    !!goalBlocksUserGrading.length &&
    goalBlocksUserGrading.every((b) => !!b.passed);

  const hasPassedAttendance =
    attendancePercentage === -1 || // just pass if there were no past appointments
    attendancePercentage >= courseGoal.attendanceGoal;

  const hasFinishedAllContentBlocks = contentBlocksFinished.percentage >= 100; // just for sanity check
  const overWrittenStatuses = await getOverwrittenUserStatuses(layerId);
  const userOverWrittenStatus = overWrittenStatuses.find(
    (i) => i.userId === userId,
  );

  const layerHasEnded =
    !!layer?.end && layer.end.getTime() < new Date().getTime();

  let userProgressStatus: MemberCourseStatus["status"] = userOverWrittenStatus
    ? userOverWrittenStatus.passed
      ? "PASSED"
      : "FAILED"
    : hasFailedARequiredBlock
    ? "RISK_OF_FAILURE"
    : !contentblocks.length || // user can pass if there are no contentBlocks but has complete attendance
      hasPassedAllRequiredBlocks ||
      hasFinishedAllContentBlocks
    ? hasPassedAttendance
      ? "PASSED"
      : futureAppointmentsCount === 0 // if there are no more appointments in the future, then this is an issue for the student
      ? "RISK_OF_FAILURE"
      : "ON_TRACK"
    : !hasPassedAttendance && futureAppointmentsCount === 0
    ? "RISK_OF_FAILURE"
    : "IN_PROGRESS";

  // factor in now layerHasEnded
  userProgressStatus = layerHasEnded
    ? userProgressStatus === "PASSED"
      ? "PASSED"
      : "FAILED"
    : !userOverWrittenStatus && userProgressStatus === "PASSED"
    ? "ON_TRACK"
    : userProgressStatus;

  return {
    finishedContentBlocks: contentBlocksFinished.finishedBlocks,
    status: userProgressStatus,
  };
}
