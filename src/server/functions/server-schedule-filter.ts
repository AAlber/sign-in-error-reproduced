import { prisma } from "../db/client";

export async function createScheduleCustomFilter(
  layerIds: string[],
  userId: string,
  name: string,
) {
  const formatLayerIds = layerIds.join(",");

  const customFilter = await prisma.scheduleUserFilter.create({
    data: {
      layerIds: formatLayerIds,
      userId,
      name,
    },
  });

  return customFilter;
}

interface ScheduleCustomFilter {
  userId: string;
  layerIds: string[];
  name: string;
}

export async function getScheduleCustomFilters(
  userId: string,
): Promise<ScheduleCustomFilter[]> {
  const customFilters = await prisma.scheduleUserFilter.findMany({
    where: {
      userId,
    },
  });

  const result = customFilters.map((filter) => ({
    userId: filter.userId,
    layerIds:
      typeof filter.layerIds === "string"
        ? filter.layerIds.split(",")
        : filter.layerIds,
    name: filter.name,
    id: filter.id,
  }));

  return result;
}

export async function deleteScheduleCustomFilter(id: string) {
  const customFilter = await prisma.scheduleUserFilter.delete({
    where: {
      id,
    },
  });

  return customFilter;
}
