import {
  type ContentBlock,
  type ContentBlockCourseGoal,
  type CourseGoal,
  Prisma,
} from "@prisma/client";
import type { UpsertCourseGoalArgs } from "@/src/pages/api/course-goals/upsert-course-goal/[layerId]";
import { prisma } from "../db/client";
import { getAppointmentsOfLayer } from "./server-appointment";
import { getAppointmentAttendenceLog } from "./server-appointment-attendence";
import { hasFinishedBlock } from "./server-content-block";
import { getOverwriteCourseUserStatusOfUser } from "./server-course-overwritten-user-status";

export async function createCourseGoal(layerId: string) {
  return await prisma.contentBlockCourseGoal.create({
    data: {
      layerId: layerId,
    },
  });
}

export async function getCourseGoalByLayerId({ layerId }: { layerId: string }) {
  const courseGoal = await prisma.contentBlockCourseGoal.findUnique({
    where: {
      layerId,
    },
  });

  if (!courseGoal) {
    const newCourseGoal = await createCourseGoal(layerId);
    return newCourseGoal;
  }

  return courseGoal;
}

export async function upsertCourseGoal({
  contentBlockId,
  layerId,
  ...data
}: UpsertCourseGoalArgs) {
  if (
    (data.attendanceGoal &&
      (data.attendanceGoal > 100 || data.attendanceGoal < 0)) ||
    (data.points && (data.points > 100 || data.points < 0))
  ) {
    throw new Error("Invalid Input");
  }

  const args = Prisma.validator<ContentBlockCourseGoal>()({
    ...data,
    ...(contentBlockId
      ? { blockGoals: { connect: { id: contentBlockId } } }
      : {}),
  });

  return await prisma.contentBlockCourseGoal.upsert({
    create: {
      layerId,
      ...args,
    },
    where: { layerId },
    update: args,
  });
}

export async function deleteCourseGoal({ id }: { id: string }) {
  return await prisma.contentBlockCourseGoal.delete({
    where: {
      id,
    },
  });
}

export async function getUserAttendenceAndGoalStatus(
  layerId: string,
  userId: string,
  goal: CourseGoal,
  contentBlocks: ContentBlock[],
): Promise<{
  attendence: AttendenceStatus;
  goalStatus: PrerequisitesStatus[];
  overwrittenStatus: OverwriteCourseUserStatus | null;
}> {
  const attendencePromise = getTotalAttendancePercentage(layerId, userId, goal);
  const goalStatusPromise = getCourseGoalStatus(userId, contentBlocks);
  const overwrittenStatusPromise = getOverwriteCourseUserStatusOfUser(
    userId,
    layerId,
  );
  const [attendence, goalStatus, overwrittenStatus] = await Promise.all([
    attendencePromise,
    goalStatusPromise,
    overwrittenStatusPromise,
  ]);
  return {
    attendence,
    goalStatus,
    overwrittenStatus,
  };
}

export async function getTotalAttendancePercentage(
  layerId: string,
  userId: string,
  goal: CourseGoal,
): Promise<AttendenceStatus> {
  try {
    const appointments = await getAppointmentsOfLayer(layerId);
    const totalAppointments = appointments.length;

    if (totalAppointments === 0) {
      return {
        percentage: 0,
        attendedAppointmentsCount: 0,
        totalAppointmentsCount: 0,
        appointmentsInFutureCount: 0,
        isRateSufficient: false,
      };
    }

    /**
     * We check the attendance rate of appointments in the PAST
     * - not including future appointments
     */
    const pastAppointments = appointments.filter(
      (i) => i.dateTime.getTime() < Date.now(),
    );

    const pastAttendanceLogsPromise = pastAppointments.map((appointment) =>
      getAppointmentAttendenceLog(userId, appointment.id),
    );

    const attendanceLogs = await Promise.all(pastAttendanceLogsPromise);
    const attendedAppointments = attendanceLogs.filter(
      (log) => log.attended,
    ).length;

    const attendancePercentage =
      (attendedAppointments / pastAppointments.length) * 100;

    return {
      percentage: Math.round(attendancePercentage * 10) / 10,
      attendedAppointmentsCount: attendedAppointments,
      totalAppointmentsCount: totalAppointments, // total appointments including FUTURE appointments
      appointmentsInFutureCount: appointments.filter(
        (appointment) => appointment.dateTime.getTime() > Date.now(),
      ).length,
      isRateSufficient: attendancePercentage >= goal.attendanceGoal,
    };
  } catch (error) {
    console.error("Error calculating total attendance percentage:", error);
    throw new Error("Unable to calculate total attendance percentage.");
  }
}

export async function getCumulatedAttendancePercentageForLayer(
  layerId: string,
  userIds: string[],
): Promise<{
  percentage: number;
  totalAppointmentsToBeAttended: number;
  attendedAppointments: number;
}> {
  try {
    const appointments = await prisma.appointment.findMany({
      where: {
        appointmentLayers: {
          some: {
            layerId,
          },
        },
        dateTime: {
          lte: new Date(),
        },
      },
      include: {
        attendenceLogs: {
          where: {
            userId: {
              in: userIds,
            },
          },
        },
      },
    });

    const totalAppointments = appointments.length * userIds.length;
    const attendanceLogs = appointments
      .map((appointment) => appointment.attendenceLogs)
      .flat();
    const attendedAppointments = attendanceLogs
      .flat()
      .filter((log) => log.attended).length;

    const attendencePercentage =
      totalAppointments === 0
        ? -1
        : (attendedAppointments / totalAppointments) * 100;

    return {
      percentage: Math.round(attendencePercentage),
      totalAppointmentsToBeAttended: totalAppointments,
      attendedAppointments,
    };
  } catch (error) {
    console.error("Error calculating total attendance percentage:", error);
    throw new Error("Unable to calculate total attendance percentage.");
  }
}

export async function getSimpleAttendancePercentageForLayer(
  layerId: string,
  userId: string,
): Promise<number> {
  try {
    /**
     * Get all past appointments then count
     * how many appointments attended by user
     */
    const pastAppointments = await prisma.appointment.findMany({
      where: {
        appointmentLayers: {
          some: {
            layerId,
          },
        },
        dateTime: {
          lte: new Date(),
        },
      },
      include: {
        attendenceLogs: {
          where: {
            userId,
          },
        },
      },
    });

    const totalAppointments = pastAppointments.length;
    const logs = pastAppointments.flatMap((appointment) => {
      return appointment.attendenceLogs;
    });

    const attendedAppointments = logs.filter((log) => log.attended).length;
    const attendencePercentage =
      totalAppointments === 0
        ? -1
        : (attendedAppointments / totalAppointments) * 100;

    return Math.round(attendencePercentage);
  } catch (error) {
    console.error("Error calculating total attendance percentage:", error);
    throw new Error("Unable to calculate total attendance percentage.");
  }
}

export async function countFutureAppointmentsOfLayer(layerId) {
  const count = await prisma.appointment.count({
    where: {
      appointmentLayers: { some: { layerId } },
      dateTime: { gt: new Date() },
    },
  });

  return count;
}

export async function getCourseGoalStatus(
  userId: string,
  contentBlocks: ContentBlock[],
): Promise<PrerequisitesStatus[]> {
  const promise = contentBlocks.map(async (block) => {
    const hasFinishedPromise = hasFinishedBlock(block.id, userId);
    const gradingPromise = getContentBlockGradingForUser(block.id, userId);
    const [hasFinished, grading] = await Promise.all([
      hasFinishedPromise,
      gradingPromise,
    ]);
    return {
      contentBlock: {
        id: block.id,
        name: block.name,
      },
      status: grading
        ? grading.passed
          ? "passed"
          : "failed"
        : hasFinished
        ? "not-rated"
        : "not-started",
      rating: grading
        ? {
            id: grading.id,
            label: grading.ratingLabel,
          }
        : null,
    };
  });

  return (await Promise.all(promise)) as PrerequisitesStatus[];
}

export async function getContentBlockFinishedPercentage(
  userId: string | string[],
  contentBlocks: ContentBlock[],
) {
  const uids = Array.isArray(userId) ? userId : [userId];
  const finishedBlocks = await prisma.contentBlockUserStatus.findMany({
    where: {
      userId: uids.length === 1 ? uids[0] : { in: uids },
      blockId: {
        in: contentBlocks.map((block) => block.id),
      },
      status: "FINISHED",
    },
  });

  return {
    percentage: Math.round(
      (finishedBlocks.length / (contentBlocks.length * uids.length)) * 100,
    ),
    finishedBlocks: finishedBlocks.length,
  };
}

export async function getContentBlockGradingForUser(
  blockId: string,
  userId: string,
) {
  const result = await prisma.contentBlockUserGrading.findFirst({
    where: {
      blockId,
      userId,
    },
  });

  return result;
}

export async function getCourseGoalContentBlocksByLayerId({
  layerId,
  onlyIds,
}: {
  layerId: string;
  onlyIds?: boolean;
}) {
  const goal = await prisma.contentBlockCourseGoal.findFirst({
    where: {
      layerId,
    },
    select: {
      blockGoals: onlyIds ? { select: { id: true } } : true,
    },
  });

  return goal ? goal.blockGoals : [];
}
