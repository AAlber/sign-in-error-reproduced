import type { Institution, Layer, Role } from "@prisma/client";
import { Prisma } from "@prisma/client";
import console from "console";
import type {
  CreateLayerOrCoursePropagateRolesArgs,
  UpdateLayerTimespanArgs,
} from "@/src/types/server/administration.types";
import cacheHandler from "@/src/utils/cache-handler/cache-redis-handler";
import { filterUndefined } from "@/src/utils/utils";
import vectorStorage from "@/src/utils/vector-handler/handler";
import { prisma } from "../db/client";
import { getAIServerHandler } from "./server-ai/handler/server-ai";
import { createCourseLobby } from "./server-chat";
import { createUserMembershipToChannel } from "./server-chat/user-management";
import { storageHandler } from "./server-cloudflare/storage-handler";
import { getCourseData } from "./server-course";
import { getSettingValues } from "./server-institution-settings";
import { getSortedUserRolesOfLayer } from "./server-role";

const STANDARD_ICON = "/illustrations/course-icon-library/book-worm.webp";

export async function createLayerAndCourse({
  id,
  name,
  parentId,
  institutionId,
  isCourse,
  start,
  end,
  externalId,
}: Omit<CreateLayerOrCoursePropagateRolesArgs, "userId">) {
  const parentStartAndEndDate = await getLayerStartAndEndDate(parentId);

  const layerPromise = createLayerPromise(
    id,
    name,
    parentId,
    institutionId,
    isCourse,
    {
      start: parentStartAndEndDate?.start ?? start ?? null,
      end: parentStartAndEndDate?.end ?? end ?? null,
    },
    undefined,
    undefined,
    undefined,
    externalId,
  );

  const coursePromise = isCourse
    ? createCoursePromise(name, id, institutionId)
    : null;

  const [layer, course] = await Promise.all([layerPromise, coursePromise]);

  if (isCourse) {
    const icon = await generateAndUpdateNewCourseIcon(institutionId, id, name);
    return { ...layer, course: { ...course, icon } };
  }

  return { ...layer };
}

export async function createLinkedCourse(
  /** The generatedLayer ID will come from frontend */
  id: string,
  /** The layerId of the actual course to link to */
  linkedCourseLayerId: string,
  parentId: string,
  institutionId: string,
) {
  const linkedCourse = await getCourseData(linkedCourseLayerId);
  if (!linkedCourse) throw new Error("Must have corresponding course data");

  const resolvedLayer = await createLayerPromise(
    id,
    `${linkedCourse.name}`,
    parentId,
    linkedCourse.institution_id,
    true,
    null,
    true,
    linkedCourseLayerId,
  );

  await transferRolesFromLayerToLayers(parentId, institutionId, [id]);
  return resolvedLayer;
}

export async function createLayerOrCourseAndPropagateRoles({
  id,
  name,
  parentId,
  institutionId,
  isCourse,
  userId,
  start,
  end,
  externalId,
}: CreateLayerOrCoursePropagateRolesArgs) {
  const layerAndCourse = await createLayerAndCourse({
    id,
    name,
    parentId,
    institutionId,
    isCourse,
    start,
    end,
    externalId,
  });

  const layersToUserIdsMapping = await transferRolesFromLayerToLayers(
    parentId,
    institutionId,
    [id],
  );

  if (isCourse) {
    const courseIcon = (layerAndCourse as any)?.course?.icon;
    const institution = await getInstitutionData(layerAndCourse.institution_id);
    try {
      const uidsFromParentLayers = [
        ...new Set(Object.values(layersToUserIdsMapping).flatMap((u) => u)),
      ].filter((uid) => uid !== userId);

      // Creates the courseChat channel
      await createCourseLobby({
        courseName: name,
        institutionId,
        layerId: id,
        userId,
        image: courseIcon,
        institutionName: institution.name,
      });

      if (!!uidsFromParentLayers.length) {
        // add users from parentLayers if any into the newly created courseChat
        await createUserMembershipToChannel(id, uidsFromParentLayers, "course");
      }
    } catch (e) {
      console.log(e);
    }
  }
  return layerAndCourse;
}

async function createLayerPromise(
  id: string,
  name: string,
  parent_id: string,
  institution_id: string,
  isCourse: boolean,
  parentStartAndEndDate: { start: OrNull<Date>; end: OrNull<Date> } | null,
  isLinkedCourse = false,
  linkedCourseLayerId?: string,
  position = 999,
  externalId?: string,
) {
  return prisma.layer.create({
    data: {
      id,
      name,
      parent_id,
      institution_id,
      isCourse,
      start: parentStartAndEndDate?.start,
      end: parentStartAndEndDate?.end,
      position, // TODO: add to end, count numLayers where parentId=parent_id
      isLinkedCourse,
      linkedCourseLayerId,
      externalId,
    },
    include: {
      parent: true,
    },
  });
}

function createCoursePromise(
  name: string,
  layer_id: string,
  institution_id: string,
) {
  return prisma.course.create({
    data: {
      name,
      layer_id,
      institution_id,
      color: Math.floor(Math.random() * 12),
      icon: "/illustrations/course-icon-library/book-worm.webp",
    },
  });
}

async function generateAndUpdateNewCourseIcon(
  institutionId: string,
  layerId: string,
  courseName: string,
) {
  const icon = await getCourseIcon(courseName, institutionId);
  await updateCourseIcon(layerId, icon);
  return icon;
}

async function updateCourseIcon(layerId, icon) {
  await prisma.course.update({
    where: { layer_id: layerId },
    data: { icon, iconType: "image" },
  });
}

export async function getLayerStartAndEndDate(id: string) {
  const layer = await prisma.layer.findUnique({
    where: { id },
    select: {
      start: true,
      end: true,
    },
  });

  return layer;
}

export async function getLayers(ids: string[]) {
  const layers = await prisma.layer.findMany({
    where: {
      id: {
        in: ids,
      },
    },
  });

  return layers;
}

export async function getLayersWithCourses(ids: string[]) {
  const layers = await prisma.layer.findMany({
    where: {
      id: {
        in: ids,
      },
    },
    include: {
      course: true,
    },
  });

  return layers;
}

export async function getLayersWithChildren(ids: string[]) {
  const layers = await prisma.layer.findMany({
    where: {
      id: {
        in: ids,
      },
    },
    include: {
      course: true,
      children: {
        include: {
          course: true,
          children: {
            include: {
              course: true,
            },
          },
        },
      },
    },
  });

  return layers;
}

export async function transferRolesFromLayerToLayers(
  newParentId: string,
  institutionId: string,
  /** The layerId itself including the ids of its children */
  ids: string[],
  /**
   * If provided, will do an extra query to the database, to determine which users have
   * direct access to currentLayer, only needed by reorderingLayerPosition
   * */
  theLayer?: Layer,
) {
  const layerToUserIdsMapping: Record<string, string[]> = {};
  const [parentRoles, layerIds] = await Promise.all([
    prisma.role.findMany({
      where: {
        institutionId,
        layerId: newParentId,
      },
    }),
    getLayers(ids),
  ]);

  let directUsersOfLayer: string[] = [];
  let usersFromParentAccess: string[] = [];

  if (theLayer && theLayer.parent_id) {
    const sortedRoles = await getSortedUserRolesOfLayer({
      layerId: ids,
      parentId: theLayer.parent_id,
      institutionId: theLayer.institution_id,
    });

    directUsersOfLayer = sortedRoles.directAccessRoles;
    usersFromParentAccess = sortedRoles.parentAccessRoles;
  }

  const _parentRoles = filterUniqueRoles(parentRoles);
  let skipDelete = false;

  // propagate the roles of each user of the parentLayer down to `ids`
  const rolesPromises = _parentRoles.map(
    ({ role, userId, layerId, active }) => {
      if (role === "admin") return Promise.resolve({ ok: true });
      if (layerId === institutionId && role !== "moderator")
        return Promise.resolve({ ok: true });

      /**
       * since there is no prisma upsertMany, to avoid duplicate roles,
       * we delete existing roles of each `userId` previously associated with the layer,
       * then we create new roles for that `userId` with respect to the `layerId`
       */
      return prisma.$transaction(async (tx) => {
        // Remove the all existing roles first, only needs to run once
        if (!skipDelete) {
          skipDelete = true;
          const removeExistingRoles = layerIds.map(
            ({ id, linkedCourseLayerId }) => {
              return tx.role.deleteMany({
                where: {
                  OR: [
                    {
                      layerId: id,
                      institutionId,
                      userId: { notIn: directUsersOfLayer }, // reset all roles except those who have direct access to the layer
                    },
                    /**
                     * remove roles from the current users with parentAccess
                     * (don't include users from previous parent access into new parent)
                     */
                    ...(linkedCourseLayerId
                      ? [
                          {
                            layerId: linkedCourseLayerId,
                            userId: { in: usersFromParentAccess },
                            institutionId,
                          },
                        ]
                      : []),
                  ],
                },
              });
            },
          );

          await Promise.all(removeExistingRoles);
        }

        // then recreate the roles, if there are linkedCourses, also create the associated roles to the ActualCourse
        await tx.role.createMany({
          data: layerIds.flatMap(({ id, linkedCourseLayerId }) => {
            const layer = layerToUserIdsMapping[id];
            layerToUserIdsMapping[id] = [
              ...new Set(layer ? [...layer, userId] : [userId]),
            ];

            return [
              {
                userId,
                layerId: id,
                institutionId,
                role,
                active,
              },
              ...(linkedCourseLayerId
                ? [
                    {
                      userId,
                      layerId: linkedCourseLayerId,
                      institutionId,
                      role,
                      active,
                    },
                  ]
                : []),
            ];
          }),
        });
      });
    },
  );

  await cacheHandler.invalidate.many(
    "user-courses-with-progress-data",
    _parentRoles
      .map((i) => i.userId)
      .concat(directUsersOfLayer)
      .concat(usersFromParentAccess),
  );

  await Promise.all(rolesPromises);
  return layerToUserIdsMapping; // just return the layerIds (along with the userIds) of the newly created roles
}

export async function getLayerWithCourse(id: string) {
  const layer = await prisma.layer.findUnique({
    where: { id },
    include: {
      course: true,
    },
  });

  if (!layer) return null;

  return {
    ...layer,
    nameWithIcon:
      (layer.isCourse ? layer?.course?.icon + " " : "") +
      (layer.displayName || layer.name),
  };
}

async function getCourseIcon(
  courseName: string,
  institutionId: string,
): Promise<string> {
  const aiSettings = await getSettingValues(institutionId, [
    "addon_artificial_intelligence",
  ]);
  if (!aiSettings.addon_artificial_intelligence) return STANDARD_ICON;

  const aiHandler = await getAIServerHandler(institutionId, "institution");
  const status = await aiHandler.get.status();
  if (status.status !== "can-use") {
    return STANDARD_ICON;
  }

  try {
    const time = new Date().getTime();
    const embedding = await aiHandler.create.embedding(courseName);
    console.log("Embedding time", new Date().getTime() - time + "ms");
    const result = await vectorStorage.index("course-icons").query({
      vector: embedding,
      topK: 1,
    });

    const icon = result.matches[0]?.metadata!.path as any;
    return icon || STANDARD_ICON;
  } catch (error) {
    console.log(error);
    return STANDARD_ICON;
  }
}

export async function getLayerWithChildren(id: string): Promise<any | null> {
  const layer = await prisma.layer.findUnique({
    where: {
      id: id,
    },
    include: {
      children: {
        orderBy: {
          name: "asc",
        },
        include: {
          children: { select: { id: true } },
          course: true,
        },
      },
    },
  });
  return layer;
}

export async function getLayerWithChildrenAndUsers(
  id: string,
): Promise<any | null> {
  const layer = await prisma.layer.findUnique({
    where: {
      id: id,
    },
    include: {
      parent: true,
      course: true,
      children: {
        orderBy: {
          name: "asc",
        },
        include: {
          children: { select: { id: true } },
          course: true,
        },
      },
    },
  });
  if (!layer) return null;
  return {
    ...layer,
  };
}

export async function getMembersAndEducatorsFromLayer(layer: Layer) {
  const roles = await prisma.role.findMany({
    where: {
      institutionId: layer.institution_id,
      layerId: layer.id,
      role: {
        in: ["member", "educator"],
      },
    },
    select: {
      user: {
        select: {
          id: true,
          image: true,
          name: true,
        },
      },
    },
  });

  return roles.map((role) => role.user);
}

export async function countMembersFromLayer(layer: Layer): Promise<any> {
  const roleCount = await prisma.role.count({
    where: {
      layerId: layer.id,
      institutionId: layer.institution_id,
      role: "member",
    },
  });

  return roleCount;
}

export async function getLayer(id: string) {
  const layer = await prisma.layer.findUnique({
    where: {
      id: id,
    },
    include: {
      children: true,
    },
  });
  return layer;
}

export async function getChildrenIdsOfLayer(
  layerId: string,
): Promise<string[]> {
  const layer = await getLayer(layerId);
  if (!layer) return [layerId];

  let childrenIds: Array<string> = [];
  if (layer.children) {
    const childrenPromises = layer.children.map(async (child) => {
      const newLayer = await getLayer(child.id);
      if (!newLayer) return [child.id];

      return getChildrenIdsOfLayer(newLayer.id);
    });
    const childrenIdsLists = await Promise.all(childrenPromises);
    childrenIds = [
      layerId,
      ...layer.children.map((child) => child.id),
      ...childrenIdsLists.flat(),
    ];
  }

  childrenIds = [...new Set([...childrenIds])]; // remove duplicate ids
  return childrenIds;
}

/**
 * returns a mapping of a LinkLayerId to its actual CourseLayerId
 * e.g. `{ [linkLayerId] : actualCourseLayerId }`
 *
 * used in:
 * - createStackedRole (need to create the role to the ActualCourse during invites)
 * - deleteStackedRole
 * */
export async function getLayerIdToLinkedCourseLayerIdMapping(
  layerId: string | string[],
) {
  const ids = Array.isArray(layerId) ? layerId : [layerId];
  const mapping = await prisma.layer.findMany({
    where: { id: { in: ids }, isCourse: true, isLinkedCourse: true },
    select: { linkedCourseLayerId: true, id: true },
  });

  const filtered = mapping.filter(
    (layer): layer is { id: string; linkedCourseLayerId: string } =>
      !!layer.linkedCourseLayerId,
  );

  return filtered.reduce(
    (a, c) => ({ ...a, [c.id]: c.linkedCourseLayerId }),
    {} as Record<string, string>,
  );
}

/**
 * Returns the associated userIds of a course from a linkedLayer
 *
 * used in:
 * - `deleteLayer` - if the layer to be deleted is a linkedLayer we also need to delete roles from the associated course
 */
export async function getUsersOfCourseByLinkLayer(
  linkLayerIds: string | string[],
  institutionId: string,
) {
  linkLayerIds = Array.isArray(linkLayerIds)
    ? linkLayerIds
    : await getChildrenIdsOfLayer(linkLayerIds);

  // get a mapping of the linkLayer to courseLayer {[linkLayerId] : actualCourseLayerId}
  const layerIdToLinkedCourseMapping =
    await getLayerIdToLinkedCourseLayerIdMapping(linkLayerIds);

  if (!Object.keys(layerIdToLinkedCourseMapping)) return;

  const linkCourseIds = Object.keys(layerIdToLinkedCourseMapping);
  const courseIds = Object.values(layerIdToLinkedCourseMapping);

  // determine who have direct access to the linkLayer
  const { directAccessRoles } = await getSortedUserRolesOfLayer({
    institutionId,
    layerId: linkCourseIds,
    parentId: institutionId,
  });

  return {
    courseIds,
    directAccessRoles,
  };
}

/**
 * Inverse of {@link getUsersOfCourseByLinkLayer}
 * Returns the userIds of a course that have gained access through linkedLayer
 *
 * used in:
 * - `getUsersOfLayer api` - filter out the users of a layer (course) who have gained access from linkedLayers
 */
export async function getUsersOfCourseFromLinkLayers(courseLayerId: string) {
  // get all linkLayerIds associated with the courseLayerId
  const linkedCourseLayers = await prisma.layer.findMany({
    where: { isLinkedCourse: true, linkedCourseLayerId: courseLayerId },
    select: { id: true },
  });

  /**
   * when creating roles for a linkedCourse, an associated role is also created to the actual course
   * so users returned should also have roles to the actual course
   */
  const users = await prisma.role.findMany({
    where: {
      layerId: { in: linkedCourseLayers.map(({ id }) => id) },
      role: { not: { equals: "admin" } },
    },
  });

  return users.map(({ userId }) => userId);
}

/**
 * Pass in the courseId to get an array of all its linkedCourse layerIds
 * if any
 *
 * Used in:
 * - deleteLayer
 * - updateRole
 */
export async function getLinkedLayersOfCourse(
  layerId: string | string[],
  select?: Prisma.LayerSelect,
) {
  layerId = Array.isArray(layerId)
    ? layerId
    : await getChildrenIdsOfLayer(layerId);

  return prisma.layer.findMany({
    where: {
      linkedCourseLayerId: { in: layerId },
    },
    select,
  });
}

export async function getInstitutionsOfUser(userId: string) {
  const roles = await prisma.role.findMany({
    where: {
      userId: userId,
    },
    select: {
      layerId: true,
    },
  });
  const institutionsOfUser: Institution[] = [];
  const institutions = await prisma.institution.findMany();
  roles.forEach((role) => {
    institutions.forEach((institution) => {
      if (institution.id == role.layerId) {
        if (!institutionsOfUser.includes(institution)) {
          institutionsOfUser.push(institution);
        }
      }
    });
  });
  return institutionsOfUser;
}

export async function getInstitutionData(institutionId: string) {
  const result = await prisma.institution.findFirstOrThrow({
    where: { id: institutionId },
  });

  return result;
}

export async function getSimpleLayer(id: string, shouldThrow = false) {
  const query = shouldThrow
    ? prisma.layer.findUniqueOrThrow
    : prisma.layer.findUnique;

  const layer = await query({ where: { id } });
  return layer;
}

export async function isLayerCourse(layerId: string) {
  const layer = await prisma.layer.findFirst({
    where: {
      id: layerId,
      isCourse: true,
    },
  });

  return !!layer;
}

export async function isAncestorOfLayer(
  layerId: string,
  layerToCheckId: string,
) {
  const childrenIds = await getChildrenIdsOfLayer(layerId);
  return childrenIds.includes(layerToCheckId);
}

export async function updateLayerRoles(layerId: string, parentId: string) {
  const layer = await getSimpleLayer(layerId, true);
  const institutionId = layer?.institution_id as string;
  const childrenIds = await getChildrenIdsOfLayer(layerId);

  const ids = [...new Set([...childrenIds, layerId])];
  return await transferRolesFromLayerToLayers(
    parentId,
    institutionId,
    ids,
    layer!,
  );
}

export async function getLayerParents(layerId: string): Promise<Layer[]> {
  const layer = await getSimpleLayer(layerId);
  if (!layer) return [];
  const parents: Layer[] = [];
  parents.push(layer);
  if (layer.parent_id) {
    const parentPath = await getLayerParents(layer.parent_id);
    parents.push(...parentPath);
  }
  return parents;
}

export async function getTimeConstrainingLayer(
  layerId: string,
): Promise<string> {
  const parents = await getLayerParents(layerId);
  const reversedParents = parents.reverse();
  const layerWithTimeConstraints = reversedParents.find(
    (parent) => parent.start || parent.end,
  );
  if (!layerWithTimeConstraints) return "";
  if (layerWithTimeConstraints.id === layerId) return "";
  return layerWithTimeConstraints.name;
}

export async function updateLayerTimeSpan({
  layerId,
  end,
  start,
}: UpdateLayerTimespanArgs) {
  const ids = await getChildrenIdsOfLayer(layerId);

  const updatedLayer = await prisma.layer.updateMany({
    where: {
      id: {
        in: ids,
      },
    },
    data: {
      start: start && start !== "Invalid Date" ? new Date(start) : null,
      end: end && end !== "Invalid Date" ? new Date(end) : null,
    },
  });

  await cacheHandler.invalidate.custom({
    prefix: "user-courses-with-progress-data",
    type: "many",
    origin: "api/administration/update-layer-timespan.ts",
    searchParam: ids,
  });

  return updatedLayer;
}

export async function getLayerPath(layerId: string): Promise<string[]> {
  const parents = await getLayerParents(layerId);
  const path = parents.map((parent) => parent.name);
  return path.reverse();
}

export async function getLayerPathId(layerId: string): Promise<string[]> {
  const parents = await getLayerParents(layerId);
  const path = parents.map((parent) => parent.id);
  return path.reverse();
}

export type CreateLayerAndCourseReturn = Awaited<
  ReturnType<typeof createLayerAndCourse>
>;

/**
 * Deletes layer along with its children and all its relations.
 * Accepts the layer's children (return of `getChildrenIdsOfLayer`),
 * or the layerId itself
 */
export async function permanentlyDeleteLayer({
  layerId,
  institutionId,
}: {
  layerId: string | string[];
  institutionId: string;
}) {
  let ids = Array.isArray(layerId)
    ? layerId
    : await getChildrenIdsOfLayer(layerId);

  // include linkedLayers if any to be deleted
  const linkedLayerIds = await getLinkedLayersOfCourse(ids);
  ids = ids.concat(linkedLayerIds.map((i) => i.id));

  // if its a linkedLayer we are deleting we have to get the associated courseId and roles
  const usersOfCourseFromLinkLayer = await getUsersOfCourseByLinkLayer(
    ids,
    institutionId,
  );

  /**
   * delete layers using raw SQL due to current one-to-Many self relation ongoing issue
   * https://github.com/prisma/prisma/issues/17649
   * relations are on Prisma level
   *
   * Layer relations
   *
   * Layer
   *  |- AppointmentLayer
   *      |- Appointment [1 Appointment - Many AppointmentLayers]
   *  |- ScheduleMonitorLayer
   *      |- InstitutionScheduleMonitor
   *  |- Invite
   *  |- Role
   *  |- Course
   *  |- CourseFeedback
   *  |- ContentBlockCourseGoal
   *  |- ContentBlock
   *      |- ContentBlockUserGrading
   *      |- ContentBlockFeedback
   *      |- ContentBlockUserStatus
   */

  // since cbRequirements are not cascaded, we fetch related cbIds first
  const contentBlockIdsRelatedToLayer = (
    await prisma.contentBlock.findMany({
      where: { layerId: { in: ids } },
    })
  ).map((i) => i.id);

  // Delete files of children of layer
  await Promise.all(
    ids.map((id) =>
      storageHandler.delete.folder(
        "institutions/" + institutionId + "/layer/" + id,
      ),
    ),
  );

  // get all roles affected by this query and invalidate
  const roles = await prisma.role.findMany({
    where: { layerId: { in: ids } },
    select: { userId: true },
  });

  const userIdsToInvalidate = roles
    .map((u) => u.userId)
    .concat(usersOfCourseFromLinkLayer?.directAccessRoles ?? []);

  await cacheHandler.invalidate.many(
    "user-courses-with-progress-data",
    userIdsToInvalidate,
  );

  return await prisma.$transaction(
    async (tx) => {
      await tx.appointment.deleteMany({
        where: {
          appointmentLayers: {
            every: {
              layerId: {
                in: ids,
              },
            },
          },
        },
      });

      await tx.institutionScheduleMonitor.deleteMany({
        where: { layers: { every: { layerId: { in: ids } } } },
      });

      await tx.appointmentLayer.deleteMany({
        where: {
          layerId: {
            in: ids,
          },
        },
      });

      await tx.course.deleteMany({
        where: { layer_id: { in: ids } },
      });

      await tx.contentBlockCourseGoal.deleteMany({
        where: { layerId: { in: ids } },
      });

      /**
       * Should cascade
       * - ContentBlock
       *    |- ContentBlockUserGrading
       *    |- ContentBlockFeedback
       *    |- ContentBlockUserStatus
       */
      await tx.contentBlock.deleteMany({
        where: { layerId: { in: ids } },
      });

      if (!!contentBlockIdsRelatedToLayer.length) {
        await tx.contentBlockRequirements.deleteMany({
          where: {
            OR: [
              { A: { in: contentBlockIdsRelatedToLayer } },
              { B: { in: contentBlockIdsRelatedToLayer } },
            ],
          },
        });
      }

      await tx.invite.deleteMany({
        where: { target: { in: ids } },
      });

      await tx.courseFeedback.deleteMany({
        where: { layerId: { in: ids } },
      });

      await tx.role.deleteMany({
        where: {
          layerId: { in: ids },
        },
      });

      if (!!usersOfCourseFromLinkLayer) {
        /**
         * if its a linkedLayer we are deleting, also delete the associated
         * roles from the actual courseLayerId
         */
        await tx.role.deleteMany({
          where: {
            layerId: { in: usersOfCourseFromLinkLayer.courseIds },
            userId: { in: usersOfCourseFromLinkLayer.directAccessRoles },
          },
        });
      }

      await tx.scheduleMonitorLayer.deleteMany({
        where: { layerId: { in: ids } },
      });

      await tx.$queryRaw`
        DELETE FROM Layer 
        WHERE id IN (${Prisma.join(ids)});
      `;

      return true;
    },
    { timeout: 60000 },
  );
}

export async function temporarilyDeleteLayers({
  layerId,
  childrenIds,
  institutionId,
}: {
  layerId: string;
  childrenIds: string[];
  institutionId: string;
}) {
  let ids = childrenIds.filter((id) => id !== layerId);

  const linkedLayerIds = await getLinkedLayersOfCourse(ids);
  ids = ids.concat(linkedLayerIds.map((i) => i.id));

  // if its a linkedLayer we are deleting we have to get the associated courseId and roles
  const usersOfCourseFromLinkLayer = await getUsersOfCourseByLinkLayer(
    ids,
    institutionId,
  );

  const roles = await prisma.role.findMany({
    where: { layerId: { in: ids } },
    select: { userId: true },
  });

  const userIdsToInvalidate = roles
    .map((u) => u.userId)
    .concat(usersOfCourseFromLinkLayer?.directAccessRoles ?? []);

  await cacheHandler.invalidate.many(
    "user-courses-with-progress-data",
    userIdsToInvalidate,
  );

  return await prisma.$transaction(async (tx) => {
    // Update parent layers to set deletedAt and remove parent_id
    await tx.layer.updateMany({
      where: { id: layerId },
      data: { deletedAt: new Date(), parent_id: null },
    });

    // Update child layers to set deletedAt without changing parent_id
    await tx.role.deleteMany({
      where: {
        layerId: { in: [layerId, ...childrenIds] },
      },
    });
  });
}

export const getDeletedLayers = async (institutionId: string) => {
  return await prisma.layer.findMany({
    where: {
      institution_id: institutionId,
      deletedAt: { not: null },
    },
    include: {
      course: true,
    },
  });
};

export const recoverLayer = async (layerId: string, institutionId: string) => {
  const layerChildrenIds = await getChildrenIdsOfLayer(layerId);
  await transferRolesFromLayerToLayers(
    institutionId,
    institutionId,
    layerChildrenIds,
  );

  return await prisma.layer.update({
    where: { id: layerId },
    data: {
      parent_id: institutionId,
      deletedAt: null,
    },
  });
};

function filterUniqueRoles(roles: Role[]) {
  const obj = roles.reduce<Record<string, Omit<Role, "id">>>(
    (acc, { id: _id, ...rest }) => {
      const { active, layerId, role, userId } = rest;
      return {
        ...acc,
        [`${role}-${rest.institutionId}-${layerId}-${userId}-${Number(
          active,
        )}`]: rest,
      };
    },
    {},
  );

  const uniqueRolesMapping = Object.keys(obj);
  return uniqueRolesMapping.map((i) => obj[i]).filter(filterUndefined);
}

export async function excludeLinkCoursesFromLayerIds(
  ids: string[],
  select?: Prisma.LayerSelect,
) {
  return await prisma.layer.findMany({
    where: {
      id: { in: ids },
      OR: [{ isLinkedCourse: null }, { isLinkedCourse: false }],
    },
    select,
  });
}
