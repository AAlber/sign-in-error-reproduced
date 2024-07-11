import { prisma } from "../db/client";

export async function overwriteCourseUserStatus(
  data: OverwriteCourseUserStatus,
) {
  const existingOverwrite = await prisma.overwrittenCourseUserStatus.findFirst({
    where: {
      userId: data.userId,
      layerId: data.layerId,
    },
  });

  if (existingOverwrite) {
    return await prisma.overwrittenCourseUserStatus.update({
      where: {
        id: existingOverwrite.id,
      },
      data: {
        passed: data.passed,
        notes: data.notes,
      },
    });
  }

  return await prisma.overwrittenCourseUserStatus.create({
    data: {
      userId: data.userId,
      layerId: data.layerId,
      passed: data.passed,
      notes: data.notes,
    },
  });
}

export async function removeOverwrittenCourseUserStatus(
  data: RemoveOverwriteCourseUserStatus,
) {
  return prisma.overwrittenCourseUserStatus.delete({ where: { id: data.id } });
}

export async function getOverwriteCourseUserStatus(id: string) {
  return prisma.overwrittenCourseUserStatus.findUnique({ where: { id: id } });
}

export async function getOverwriteCourseUserStatusOfUser(
  userId: string,
  layerId: string,
): Promise<OverwriteCourseUserStatus | null> {
  const status: OverwriteCourseUserStatus | null =
    await prisma.overwrittenCourseUserStatus.findFirst({
      where: {
        userId: userId,
        layerId: layerId,
      },
      select: {
        layerId: true,
        userId: true,
        passed: true,
        notes: true,
      },
    });

  return status;
}

export async function getOverwrittenUserStatuses(layerId: string) {
  return prisma.overwrittenCourseUserStatus.findMany({
    where: { layerId: layerId },
    select: {
      id: true,
      userId: true,
      passed: true,
      notes: true,
    },
  });
}
