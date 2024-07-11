import { clerkClient } from "@clerk/nextjs/server";
import { filterUndefined, splitIntoChunksOf } from "@/src/utils/utils";
import { prisma } from "../../db/client";
import {
  buildLayerTree,
  flattenLayerTree,
} from "../server-administration-dashboard";
import { filterUniqueBy } from "../server-utils";
import type { FuxamLayerType } from "./types";

export async function getUsersOfOrganization(institutionId: string) {
  const roles = await prisma.role.findMany({
    where: {
      active: true,
      institutionId: institutionId,
      layerId: institutionId,
      userId: { not: undefined },
    },
    select: {
      user: { select: { email: true } },
    },
    distinct: "userId",
  });

  const users = roles.map(({ user }) => user);
  const uniqueUsers = filterUniqueBy(users, "email");

  // clerk sdk limit is < 501 https://clerk.com/docs/references/backend/user/get-user-list#user-list-params
  const limit = 500;
  const chunkedUsers = splitIntoChunksOf(uniqueUsers, limit);

  const clerkUsers = await Promise.all(
    chunkedUsers.map(async (chunk) => {
      const { data } = await clerkClient.users.getUserList({
        emailAddress: chunk.map(({ email }) => email),
        limit,
      });
      return data;
    }),
  );

  const clerkUsersFlat = clerkUsers.flatMap((userChunk) => userChunk);
  const normalizedUsers = clerkUsersFlat
    .map((user) => {
      const userPrimaryEmail = user.emailAddresses.find(
        ({ id }) => id === user.primaryEmailAddressId,
      );
      if (!userPrimaryEmail) return;

      const email = userPrimaryEmail.emailAddress;
      return {
        ...user,
        email,
      };
    })
    .filter(filterUndefined);

  return normalizedUsers;
}

export async function getLayersOfInstitution(
  institutionId: string,
  isCourse?: boolean,
) {
  const layers = await prisma.layer.findMany({
    where: {
      institution_id: institutionId,
      isTemplate: false,
      isLinkedCourse: false,
      ...(typeof isCourse === "boolean" ? { isCourse } : {}),
    },
    include: {
      course: {
        select: { name: true, description: true },
      },
    },
  });

  const layerTree = buildLayerTree(layers as any);
  return flattenLayerTree(layerTree) as unknown as FuxamLayerType[];
}
