import type { UserResponse } from "stream-chat";
import type { StreamChatGenerics } from "@/src/components/reusable/page-layout/navigator/chat/types";
import type { BaseUser } from "@/src/components/reusable/user-search-select-modal/types";
import { log } from "@/src/utils/logger/logger";
import { prisma } from "../../db/client";
import { getLayerPath, getSimpleLayer } from "../server-administration";
import { streamChat } from "./index";

type GetUsersForChatCreationArgs = {
  userId: string;
  search?: string;
  userIdsToExclude: string[];
};

export async function getUsersForChatCreation(
  args: GetUsersForChatCreationArgs,
): Promise<BaseUser[]> {
  const { userId, search, userIdsToExclude } = args;

  const roles = await prisma.role.findMany({
    where: { userId: { equals: userId } },
    distinct: "institutionId",
  });

  log.info("getUsersForChatCreation", args);

  const usersOfInstitution = await prisma.user.findMany({
    where: {
      roles: {
        some: {
          institutionId: { in: roles.map((u) => u.institutionId) },
        },
      },
      ...(search
        ? {
            OR: [
              { name: { contains: search } },
              { email: { contains: search } },
            ],
          }
        : {}),
      id: {
        notIn: [userId].concat(userIdsToExclude),
      },
    },
    take: 20,
  });

  const usersOfInstitutionIds = usersOfInstitution.map((u) => u.id);
  let streamUsers: UserResponse<StreamChatGenerics>[] = [];

  if (!!usersOfInstitution.length) {
    // getstream will throw if usersOfInstitutionIds is empty
    const streamUserResponse = await streamChat.queryUsers({
      id: {
        $in: usersOfInstitutionIds,
      },
    });
    streamUsers = streamUserResponse.users;
  }

  const registeredUserIds = streamUsers.map((u) => u.id);

  return usersOfInstitution.map((user) => ({
    ...user,
    disabled: !registeredUserIds.includes(user.id),
  }));
}

/**
 * this fn will be used in `get-users-for-chat-creation` api which supposedly should only return a user,
 * but new requirements added to also include courses in the response, so we just emulate the {@link BaseUser} interface here,
 * main difference is if its a course, email.startsWith("course")
 */
export async function getCoursesForChatCreation(
  userId: string,
  institutionId: string,
  search: string,
): Promise<BaseUser[]> {
  log.info("getCoursesForChatCreation", {
    search,
    userId,
    institutionId,
  });

  const institutionLayer = await getSimpleLayer(institutionId);

  const layers = await prisma.role.findMany({
    where: {
      institutionId,
      userId,
      layerId: { not: institutionId },
      layer: {
        isCourse: true,
        isLinkedCourse: false,
        name: { contains: search },
      },
    },
    select: { layer: { include: { course: true } } },
    distinct: "layerId",
  });

  return Promise.all(
    layers.map(async (i) => {
      let pathToLayer = await getLayerPath(i.layer.id);
      pathToLayer = pathToLayer.filter(
        (name) => institutionLayer?.name !== name,
      );

      const pathToLayerStr =
        pathToLayer.length === 1 ? "" : pathToLayer.join(" > ");

      return {
        name: i.layer.name,
        currentInstitution: i.layer.institution_id,
        email: `course ${!!pathToLayerStr ? `( ${pathToLayerStr} )` : ""}`,
        disabled: false,
        id: i.layer.id,
        language: "",
        image: i.layer.course?.icon || null,
        emailVerified: null,
        memberSince: null,
        password: null,
        stripeAccountId: null,
      };
    }),
  );
}
