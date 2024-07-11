import type { ContentBlock, ContentBlockUserGrading } from "@prisma/client";
import type {
  ContentBlockUserDataMapping,
  ContentBlockUserStatus,
  ContentBlockUserStatusOfUser,
} from "@/src/types/content-block/types/user-data.types";
import { prisma } from "../db/client";
import { getMembersOfCourse } from "./server-course";
import { getUser, getUsersByIds } from "./server-user";

export async function hasFinishedBlock(
  blockId: string,
  userId: string,
): Promise<boolean> {
  const userBlockStatus = await prisma.contentBlockUserStatus.findFirst({
    where: { blockId, userId },
  });

  return userBlockStatus?.status === "FINISHED";
}

export async function getContentBlocksOfLayer(layerId: string) {
  return await prisma.contentBlock.findMany({
    where: {
      layerId: layerId,
    },
  });
}

export async function getPublishContentBlocksOfLayer(layerId: string) {
  return await prisma.contentBlock.findMany({
    where: { layerId, status: "PUBLISHED" },
  });
}

export async function getContentBlock(id: string) {
  return await prisma.contentBlock.findUnique({
    where: {
      id,
    },
  });
}

export async function getContentBlockUserStatus(
  block: ContentBlock,
  includeUserData = false,
) {
  const members = await getMembersOfCourse(block.layerId);

  // will also include status and grading from previous members of course
  const [userData, contentBlockGradings] = await Promise.all([
    prisma.contentBlockUserStatus.findMany({
      where: {
        blockId: block.id,
      },
      select: {
        status: true,
        userId: true,
        data: includeUserData,
      },
    }),
    prisma.contentBlockUserGrading.findMany({
      where: { blockId: block.id },
    }),
  ]);

  // normalize the return
  function createStatusAndGrading(user: SimpleUser) {
    const userStatus = userData.find((data) => data.userId === user.id);
    const rating = contentBlockGradings.find(
      (grade) => grade.userId === user.id,
    );

    return {
      ...user,
      status: userStatus?.status ?? "NOT_STARTED",
      userData: userStatus?.data,
      ...(rating ? { rating } : {}),
    };
  }

  const memberIds = members.map((i) => i.id);
  const previousMemberIdsOfCourse = userData
    .filter(({ userId }) => !memberIds.includes(userId))
    .map(({ userId }) => userId);

  const previousCourseMembers = !!previousMemberIdsOfCourse.length
    ? await getUsersByIds(previousMemberIdsOfCourse)
    : [];

  const data = members
    .map(createStatusAndGrading)
    .concat(previousCourseMembers.map(createStatusAndGrading));

  return data as ContentBlockUserStatus[];
}

export async function getContentBlockUserStatusForSpecificUser<
  T extends keyof ContentBlockUserDataMapping | undefined = undefined,
>(
  block: ContentBlock,
  userId: string,
): Promise<ContentBlockUserStatusOfUser<T>> {
  const user = await getUser(userId);
  if (!user) throw new Error("User not found");
  const userData = await prisma.contentBlockUserStatus.findFirst({
    where: {
      blockId: block.id,
      userId,
    },
    select: {
      status: true,
      data: true,
    },
  });

  const grading = (await prisma.contentBlockUserGrading.findFirst({
    where: { blockId: block.id, userId },
  })) as ContentBlockUserGrading;

  let grader;
  if (grading && grading.graderUserId) {
    grader = await prisma.user.findFirst({
      where: {
        id: grading.graderUserId || "",
      },
      select: {
        name: true,
        image: true,
        id: true,
      },
    });
  }

  return {
    status: userData ? userData.status : "NOT_STARTED",
    userData: userData ? (userData.data as any) : undefined,
    rating: grading ? grading : undefined,
    graderProfile: grader ? grader : undefined,
  };
}

export async function upsertContentBlockUserStatus<
  T extends keyof ContentBlockUserDataMapping,
>({
  blockId,
  layerId,
  userId,
  data,
  updateUserData = true,
}: {
  blockId: string;
  layerId: string;
  userId: string;
  data: Partial<ContentBlockUserStatusOfUser<T>>;
  updateUserData?: boolean;
}) {
  const status = await prisma.contentBlockUserStatus.findFirst({
    where: { blockId: blockId, userId },
  });
  if (!status) {
    const createData: any = {
      blockId: blockId,
      userId,
      layerId: layerId,
      status: data.status,
      data: updateUserData ? (data.userData as any) : {},
    };
    const createStatus = await prisma.contentBlockUserStatus.create({
      data: createData,
    });
    return createStatus;
  } else {
    const updateData: any = {};
    if (updateUserData) {
      updateData.data = data.userData;
    }
    updateData.status = data.status;
    const updateStatus = await prisma.contentBlockUserStatus.updateMany({
      where: {
        blockId,
        userId,
      },
      data: updateData,
    });
    return updateStatus;
  }
}
