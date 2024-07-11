import type {
  LayersOfUser,
  LayersWithCourseAndChildren,
  LayerWithCourseAndChildren,
  LayerWithMinimumCourseData,
  Roles,
} from "@/src/types/server/dashboard.types";
import { filterUndefined } from "@/src/utils/utils";
import { prisma } from "../db/client";
import { storageHandler } from "./server-cloudflare/storage-handler";
import { createSimpleRole } from "./server-role";

export async function getLayersForUserBasedOnRoles(
  userId: string,
  institutionId: string,
) {
  const roles = await getRolesOfUser(userId, institutionId);

  const [rootLayer, layers, storageOverview] = await Promise.all([
    getRootLayer(userId, institutionId),
    getLayersOfUser(institutionId, roles),
    storageHandler.list.layerSizes(institutionId),
  ]);
  const initialLayers = getInitialLayersOfUser(layers, roles);

  // Initially add size to layers
  addSizeToLayers(initialLayers, storageOverview);

  // Update parent layer sizes based on the sizes of immediate children
  updateParentLayerSizes(initialLayers);

  return {
    ...rootLayer,
    children: initialLayers,
  };
}

function addSizeToLayers(layers, storageOverview) {
  layers.forEach((layer) => {
    // Find the storage information for the current layer
    const storageEntries = storageOverview.filter(
      (info) => info.layerId === layer.id,
    );
    // Sum all sizes for the layerId in case there are multiple entries
    const totalSize = storageEntries.reduce((acc, curr) => acc + curr.size, 0);

    // Add the size property if storage information is found
    layer.storageUsage = totalSize;

    // If the layer has children, recursively add size to them as well
    if (layer.children && layer.children.length > 0) {
      addSizeToLayers(layer.children, storageOverview);
    }
  });
}

function sumChildrenSizes(layer) {
  // If the layer has no children, its own size is returned
  if (!layer.children || layer.children.length === 0) {
    return layer.storageUsage || 0;
  }

  // Sum sizes of all the immediate children layers
  const childrenSize = layer.children.reduce((total, child) => {
    return total + sumChildrenSizes(child); // Sum sizes recursively
  }, 0);

  // Add the size of the children to the current layer's size
  layer.storageUsage = childrenSize;

  // Return the accumulated size
  return layer.storageUsage;
}

function updateParentLayerSizes(layers) {
  // Call sumChildrenSizes for each top-level layer to initiate recursive size calculation
  layers.forEach((layer) => sumChildrenSizes(layer));
}

async function getRootLayer(userId: string, institutionId: string) {
  try {
    const rootLayer = await prisma.layer.findUnique({
      where: { id: institutionId },
      select: { id: true, name: true, institution_id: true },
    });
    return rootLayer
      ? rootLayer
      : await createRootLayerAndRole(userId, institutionId);
  } catch (error) {
    // Log error or handle it as per your application's error handling strategy
    console.error("Error fetching root layer:", error);
    throw error;
  }
}

async function createRootLayerAndRole(userId: string, institutionId: string) {
  const institution = await prisma.institution.findUnique({
    where: { id: institutionId },
    select: { id: true, name: true },
  });
  if (!institution) throw new Error("Institution not found");

  const rootLayer = await prisma.layer.create({
    data: {
      id: institution.id,
      name: institution.name,
      institution_id: institution.id,
    },
  });

  await createSimpleRole({
    userId,
    institutionId: institution.id,
    layerId: institution.id,
    role: "moderator",
    active: true,
  });
  return rootLayer;
}

async function getLayersOfUser(institutionId: string, roles: Roles) {
  const { layers } = (await prisma.institution.findFirstOrThrow({
    where: { id: institutionId },
    include: {
      layers: {
        where: {
          OR: [
            {
              id: {
                in: roles
                  .filter((role) => role.role === "moderator")
                  .map((role) => role.layerId),
              },
            },
            {
              AND: [
                {
                  OR: [
                    { start: null },
                    {
                      start: {
                        lte: new Date(),
                      },
                    },
                  ],
                },
                {
                  OR: [
                    { end: null },
                    {
                      end: {
                        gte: new Date(),
                      },
                    },
                  ],
                },
                {
                  id: {
                    in: roles.map((role) => role.layerId),
                  },
                },
              ],
            },
          ],
        },
        select: {
          id: true,
          parent_id: true,
          name: true,
          position: true,
          start: true,
          isCourse: true,
          end: true,
          displayName: true,
          institution_id: true,
          isLinkedCourse: true,
          linkedCourseLayerId: true,
          // LinkedCourses: { select: { id: true } },
          course: {
            select: {
              name: true,
              icon: true,
              iconType: true,
              layer_id: true,
            },
          },
        },
        orderBy: { position: "asc" },
      },
    },
  })) satisfies LayersOfUser;

  // TODO: TEMPORARY TYPE FIX -------------- vv
  const layerTree = buildLayerTree(layers as any, institutionId);
  return layerTree;
}

export function getInitialLayersOfUser(
  layers: LayersWithCourseAndChildren,
  roles: Roles,
) {
  const moderatorLayers = layers.filter((layer) =>
    roles.some(
      (role) => role.layerId === layer.id && role.role === "moderator",
    ),
  );

  const topLayers = moderatorLayers
    .map((layer) => {
      if (layers.filter((l) => l.id === layer.parent_id).length === 0) {
        const children = layer.children.map((child) => {
          return {
            ...child,
            moderators: (layers.find((l) => l.id === child.id) as any)
              ?.moderators,
          };
        });

        return {
          ...layer,
          children,
        };
      }
    })
    .filter(filterUndefined);

  return topLayers;
}

export async function getRolesOfUser(
  userId: string,
  institutionId: string,
): Promise<Roles> {
  if (!institutionId) return [];
  const roles = await prisma.role.findMany({
    where: {
      userId: userId,
      institutionId: institutionId,
    },
    select: {
      layerId: true,
      role: true,
    },
  });

  return roles;
}

export function flattenLayerTree(
  layerTree: LayersWithCourseAndChildren,
  parentId: string | null = null,
  depth = 0,
): LayersWithCourseAndChildren {
  return layerTree.reduce<LayersWithCourseAndChildren>((acc, item, index) => {
    return [
      ...acc,
      { ...item, parentId, depth, index },
      ...flattenLayerTree(
        item.children as LayersWithCourseAndChildren,
        item.id,
        depth + 1,
      ),
    ];
  }, []);
}

export function buildLayerTree(
  layers: LayerWithMinimumCourseData[],
  rootId = "root",
) {
  type layer = LayerWithCourseAndChildren;
  const nodesById: Record<string, layer> = {
    [rootId]: {
      children: [] as layer["children"],
    } as layer,
  };

  // Create all nodes and add them to `nodesById`.
  layers.forEach((layer) => {
    nodesById[layer.id] = { ...layer, children: [] };
  });

  // Add nodes to their parent's `children` array.
  layers.forEach((layer) => {
    if (
      layer.parent_id &&
      nodesById[layer.parent_id] &&
      layer.parent_id !== layer.id
    ) {
      nodesById[layer.parent_id]?.children.push(nodesById[layer.id] as layer);
    } else {
      // if parent_id doesn't exist, is not in the layers list, or points to itself,
      // assign it to root.
      if (layer.id !== rootId) {
        // prevent adding the root to its own children
        nodesById[rootId]?.children.push(nodesById[layer.id] as layer);
      }
    }
  });

  // Return the root node's children.
  return nodesById[rootId]?.children || [];
}
