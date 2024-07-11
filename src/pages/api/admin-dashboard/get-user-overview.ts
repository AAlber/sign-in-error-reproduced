import { getAuth } from "@clerk/nextjs/server";
import type { User } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { filterUndefined } from "@/prisma/random-seed";
import { prisma } from "@/src/server/db/client";
import { canAccessAdminDashboard } from "@/src/server/functions/server-admin-dashboard";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "GET") {
    try {
      const { userId } = getAuth(req);
      canAccessAdminDashboard(
        userId!,
        req.query.adminDashPassword as string,
        res,
      );
      const institutionId = req.query.institutionId as string;

      const users = await getUsersWithTheirHighestRoles(institutionId);

      res.status(200).json(users);
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Failed to get Institutions:" + (error as Error)?.message,
      });
    }
  }
}

// First, define a type for the user and their role to help TypeScript understand your data structure.
type UserWithHighestRole = {
  user: User; // Assuming User is a predefined type or you need to define this type as well.
  highestRole: string;
  active: boolean;
};

export async function getUsersWithTheirHighestRoles(
  institutionId: string,
): Promise<((User | undefined) & { role?: string })[]> {
  const roles = await prisma.role.findMany({
    where: {
      institutionId,
    },
    include: {
      user: true,
    },
  });

  const rolePriority = {
    admin: 4,
    moderator: 3,
    educator: 2,
    member: 1,
    none: 0, // 'none' as the lowest possible role, you can adjust this according to your model.
  };

  // Use a properly typed accumulator for the reduce function.
  const usersWithRoles: Record<string, UserWithHighestRole> = roles.reduce(
    (acc, role) => {
      const userId = role.user?.id;
      if (userId) {
        if (!acc[userId]) {
          acc[userId] = {
            user: role.user,
            highestRole: role.role,
            active: role.active,
          };
        } else {
          // Compare and store the highest role
          if (rolePriority[role.role] > rolePriority[acc[userId].highestRole]) {
            acc[userId].highestRole = role.role;
          }
        }
      }
      return acc;
    },
    {},
  );

  // Convert the map back to an array of user objects with their highest role
  const usersWithHighestRoles = Object.values(usersWithRoles)
    .map(({ user, highestRole, active }) => {
      if (!active) return undefined;
      return {
        id: user.id ?? "default-id",
        name: user.name ?? "default-name",
        email: user.email ?? "default-email",
        password: user.password,
        emailVerified: user.emailVerified,
        image: user.image,
        language: user.language,
        currentInstitution: user.currentInstitution,
        memberSince: user.memberSince,
        stripeAccountId: user.stripeAccountId,
        role: highestRole,
      };
    })
    .filter(filterUndefined);

  return usersWithHighestRoles;
}
