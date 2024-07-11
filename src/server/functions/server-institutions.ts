import { prisma } from "../db/client";
import { sentry } from "../singletons/sentry";
import { storageHandler } from "./server-cloudflare/storage-handler";
import { getMemberIdsOfInstitution } from "./server-role";
import { removeCurrentInstitutionIfIdEquals } from "./server-user-mgmt";

export const getInstitutionById = async (institutionId: string) => {
  const response = await prisma.institution.findUnique({
    where: {
      id: institutionId,
    },
  });
  return response;
};

// TODO: use ContentBlock model instead of CourseContentBlock

export const deleteAllInstitutionData = async (
  userId: string,
  institutionId: string,
) => {
  const memberIds = await getMemberIdsOfInstitution(institutionId);
  await storageHandler.delete.folder("institutions/" + institutionId);
  await removeCurrentInstitutionIfIdEquals(institutionId, memberIds);
  await deleteAllInstitutionUserGroupMemberships(institutionId);
  await deleteAllInstitutionRooms(institutionId);
  await deleteAllInstitutionUserGroups(institutionId);
  await deleteAllInstitutionInvites(institutionId);
  await deleteAllInstitutionTasks(institutionId);
  await deleteAllInstitutionHandins(institutionId);
  await deleteAllInstitutionAutoLessonAndChats(institutionId);
  await deleteAllInstitutionCourseContentBlocks(institutionId);
  await deleteAllInstitutionCourseContentBlockRequirements(institutionId);
  await deleteAllInstitutionSettings(institutionId);
  await deleteAllInstitutionAppointments(institutionId);
  await deleteInstitutionAIUsage(institutionId);
  await deleteInstitutionScheduleMonitor(institutionId);
  await deleteAllInstitutionCourses(institutionId);
  await deleteAllInstitutionLayers(institutionId);
  await deleteInstitution(institutionId);
};

export const deleteInstitution = async (institutionId: string) => {
  const response = prisma.$queryRaw`DELETE FROM Institution WHERE id = ${institutionId}`;
  return response;
};

export const deleteAllInstitutionLayers = async (institutionId: string) => {
  const response =
    await prisma.$queryRaw`DELETE FROM Layer WHERE institution_id = ${institutionId}`;
  return response;
};

export const deleteAllInstitutionCourses = async (institutionId: string) => {
  const response =
    await prisma.$queryRaw`DELETE FROM Course WHERE institution_id = ${institutionId}`;
  return response;
};
export const deleteAllInstitutionUserGroupMemberships = async (
  institutionId: string,
) => {
  const response = await prisma.institutionUserGroupMembership.deleteMany({
    where: {
      institutionId: institutionId,
    },
  });
  return response;
};
export const deleteAllInstitutionRooms = async (institutionId: string) => {
  const response = await prisma.institutionRoom.deleteMany({
    where: {
      institutionId: institutionId,
    },
  });
  return response;
};
export const deleteAllInstitutionSettings = async (institutionId: string) => {
  const response = await prisma.institutionSettings.deleteMany({
    where: {
      institutionId: institutionId,
    },
  });
  return response;
};
export const deleteAllInstitutionUserGroups = async (institutionId: string) => {
  const response = await prisma.institutionUserGroup.deleteMany({
    where: {
      institutionId: institutionId,
    },
  });
  return response;
};
export const deleteAllInstitutionInvites = async (institutionId: string) => {
  const response = await prisma.invite.deleteMany({
    where: {
      institution_id: institutionId,
    },
  });
  return response;
};
export const deleteAllInstitutionCourseContentBlocks = async (
  layerId: string,
) => {
  const response = await prisma.courseContentBlock.deleteMany({
    where: {
      layerId: layerId,
    },
  });
  return response;
};

export const deleteAllInstitutionCourseContentBlockRequirements = async (
  layerId: string,
) => {
  const response = await prisma.courseContentBlock.deleteMany({
    where: {
      layerId: layerId,
    },
  });
  return response;
};
export const deleteAllInstitutionTasks = async (layerId: string) => {
  const response = await prisma.task.deleteMany({
    where: {
      layerId: layerId,
    },
  });
  return response;
};
export const deleteAllInstitutionHandins = async (layerId: string) => {
  const response = await prisma.handIn.deleteMany({
    where: {
      layerId: layerId,
    },
  });
  return response;
};
export const deleteAllInstitutionAutoLessonAndChats = async (
  layerId: string,
) => {
  const autoLessons = await prisma.autoLesson.findMany({
    where: {
      layerId: layerId,
    },
    include: {
      chats: true,
    },
  });
  await prisma.autoLesson.deleteMany({
    where: {
      layerId: layerId,
    },
  });

  const promises: Promise<any>[] = [];
  for (const lesson of autoLessons) {
    lesson.chats.forEach(async () => {
      promises.push(
        prisma.autoLessonChat.deleteMany({
          where: {
            autoLessonId: lesson.id,
          },
        }),
      );
    });
  }
  const responses = await Promise.all(promises);
  return responses;
};

export async function deleteInstitutionAIUsage(institutionId: string) {
  const response = await prisma.institutionAIUsageStatus.deleteMany({
    where: {
      institutionId: institutionId,
    },
  });

  const response2 = await prisma.institutionAIUsageLog.deleteMany({
    where: {
      institutionId: institutionId,
    },
  });
  return { response, response2 };
}

export async function deleteInstitutionScheduleMonitor(institutionId: string) {
  const response = await prisma.institutionScheduleMonitor.deleteMany({
    where: {
      institutionId: institutionId,
    },
  });

  const response2 = await prisma.scheduleMonitorLayer.deleteMany({
    where: {
      institutionId: institutionId,
    },
  });
  return { response, response2 };
}

export const deleteAllInstitutionAppointments = async (layerId: string) => {
  const appointments = await prisma.appointment.findMany({
    where: {
      appointmentLayers: {
        some: {
          layerId: layerId,
        },
      },
    },
    include: {
      series: true,
    },
  });
  const promises: Promise<any>[] = [];
  for (const appointment of appointments) {
    await prisma.appointmentSeries.deleteMany({
      where: {
        id: appointment.series?.id,
      },
    });
  }
  const responses = await Promise.all(promises);
  return responses;
};

export const createAdminRoles = async (
  institutionId: string,
  userId: string,
) => {
  sentry.addBreadcrumb({
    message: "Creating admin roles",
    data: { userId, institutionId },
  });

  await prisma.role.createMany({
    data: [
      {
        userId: userId,
        institutionId: institutionId,
        layerId: institutionId,
        role: "admin",
      },
      {
        userId: userId!,
        institutionId: institutionId,
        layerId: institutionId,
        role: "moderator",
      },
      {
        userId: userId!,
        institutionId: institutionId,
        layerId: institutionId,
        role: "member",
      },
    ],
  });
};
