import { getAuth } from "@clerk/nextjs/server";
import type { Layer } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/src/server/db/client";
import {
  getChildrenIdsOfLayer,
  getSimpleLayer,
  getUsersOfCourseFromLinkLayers,
} from "@/src/server/functions/server-administration";
import {
  getUserIdsWithRoles,
  hasRolesWithAccess,
} from "@/src/server/functions/server-role";
import type {
  AccessLevel,
  GetUsersOfLayer,
  LayerUserFilter,
  UserWithAccess,
} from "@/src/types/user-management.types";
import { defaultFilter } from "@/src/types/user-management.types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<UserWithAccess[] | { message: string }>,
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { userId } = getAuth(req);
  if (!userId) {
    return res.status(400).json({ message: "User ID is required" });
  }

  const data = req.query as unknown as GetUsersOfLayer;
  if (!data.layerId) {
    return res.status(400).json({ message: "Layer ID is required" });
  }

  if (
    !(await hasRolesWithAccess({
      layerIds: [data.layerId],
      userId,
      rolesWithAccess: ["admin", "moderator", "educator"],
    }))
  ) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const layer = await getSimpleLayer(data.layerId);
  if (!layer) throw new Error(`Layer with id ${data.layerId} not found`);

  let users = await fetchLayerUsers(data, layer);

  if (layer.isCourse && !layer.isLinkedCourse) {
    // If layer is a course, filter out any users who have gained access through linkLayers
    const usersOfCourseViaLinkLayer = await getUsersOfCourseFromLinkLayers(
      layer.id,
    );

    users = users.filter((u) => !usersOfCourseViaLinkLayer.includes(u.id));
  }

  return res.status(200).json(users);
}

async function fetchLayerUsers(
  data: GetUsersOfLayer,
  layer: Layer,
): Promise<UserWithAccess[]> {
  const layerId = data.layerId;
  const searchQuery = data.search || "";
  const filter: LayerUserFilter =
    JSON.parse(data.filter as any) || defaultFilter;

  // Fetch related layer ids
  const relatedLayerIds = await getRelatedLayerIds(layer, filter);

  const allowedActiveStates =
    filter.allowedAccessStates.includes("active") &&
    !filter.allowedAccessStates.includes("inactive")
      ? true
      : filter.allowedAccessStates.includes("inactive") &&
        !filter.allowedAccessStates.includes("active")
      ? false
      : undefined;

  const whereClause = {
    layerId: {
      in: relatedLayerIds,
    },
    role: {
      in: filter.allowedRoles,
    },
    active: allowedActiveStates,
    user: {
      name: {
        contains: searchQuery,
      },
    },
  };

  // Query to fetch roles with conditions
  const roles = await prisma.role.findMany({
    where: whereClause,
    select: {
      user: {
        select: {
          id: true,
          name: true,
          image: true,
          email: true,
          invites: {
            where: {
              target: {
                in: [layerId, layer.institution_id],
              },
            },
          },
        },
      },
      role: true,
      active: true,
      layerId: true,
    },
    // Optionally, add ordering
    orderBy: {
      user: {
        name: "asc",
      },
    },
  });

  const adminIds = await getUserIdsWithRoles(layer.institution_id, ["admin"]);

  // Process the fetched data and map to UserWithAccess[]
  const users: UserWithAccess[] = roles.map((role) => {
    return {
      id: role.user.id,
      name: role.user.name,
      image: role.user.image,
      email: role.user.email,
      role: role.role as Role,
      accessLevel: determineAccessLevel(role, layer, layer.parent_id), // Example logic, adjust as needed
      accessState: role.active ? "active" : "inactive",
      invite: role.user.invites[0] || null,
    };
  });

  const uniqueUsers = users.filter(
    (user, index, self) => self.findIndex((u) => u.id === user.id) === index,
  );

  const filteredUsers = uniqueUsers.filter((user) => {
    if (adminIds.includes(user.id)) {
      return false;
    }

    const accessLevelMatch = filter.allowedAccessLevels.includes(
      user.accessLevel,
    );

    const accessStateMatch = filter.allowedAccessStates.includes(
      user.accessState,
    );

    return accessLevelMatch && accessStateMatch;
  });

  return filteredUsers;
}

async function getRelatedLayerIds(
  layer: Layer,
  filter: LayerUserFilter,
): Promise<string[]> {
  const relatedLayerIds = new Set<string>();
  relatedLayerIds.add(layer.id);

  // Check if parent-access is needed
  if (layer.parent_id && layer.parent_id !== layer.institution_id) {
    relatedLayerIds.add(layer.parent_id);
  }

  // Check if partial-access is needed
  if (filter.allowedAccessLevels.includes("partial-access")) {
    const childIds = await getChildrenIdsOfLayer(layer.id);
    childIds.forEach((id) => relatedLayerIds.add(id));
  }

  return Array.from(relatedLayerIds);
}

function determineAccessLevel(
  role,
  layer: Layer,
  parentLayerId: string | null,
): AccessLevel {
  // Assuming role has properties like layerId or similar to determine the access level
  if (
    parentLayerId &&
    role.layerId === parentLayerId &&
    layer.institution_id !== parentLayerId
  ) {
    return "parent-access";
  } else if (role.layerId === layer.id) {
    return "access";
  } else {
    return "partial-access";
  }
}
