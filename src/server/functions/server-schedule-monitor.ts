import { prisma } from "../db/client";

export async function createScheduleMonitor(institutionId: string) {
  const scheduleMonitor = await prisma.institutionScheduleMonitor.create({
    data: {
      institutionId,
    },
  });

  return scheduleMonitor;
}

export async function getScheduleMonitor(institutionId: string) {
  const scheduleMonitor = await prisma.institutionScheduleMonitor.findUnique({
    where: {
      institutionId,
    },
  });

  return scheduleMonitor;
}

export async function getScheduleMonitorOrCreate(institutionId: string) {
  const scheduleMonitor = await getScheduleMonitor(institutionId);
  if (scheduleMonitor) return scheduleMonitor;
  const newScheduleMonitor = await createScheduleMonitor(institutionId);
  return newScheduleMonitor;
}

export async function addLayerToMonitor(
  layerId: string,
  institutionId: string,
) {
  const monitor = await getScheduleMonitorOrCreate(institutionId);
  const position = await prisma.scheduleMonitorLayer.count({
    where: {
      institutionId,
      monitorId: monitor.id,
    },
  });

  const monitorLayer = await prisma.scheduleMonitorLayer.create({
    data: {
      layerId,
      institutionId,
      monitorId: monitor.id,
      position: position,
    },
  });
  return monitorLayer;
}

export async function removeLayerFromMonitor(
  layerId: string,
  institutionId: string,
) {
  const monitor = await getScheduleMonitorOrCreate(institutionId);
  const monitorLayer = await prisma.scheduleMonitorLayer.deleteMany({
    where: {
      layerId,
      institutionId,
      monitorId: monitor.id,
    },
  });
  return monitorLayer;
}

export async function updateLayerPositionsOnMonitor(
  institutionId: string,
  layers: {
    id: string;
    position: number;
  }[],
) {
  const monitor = await getScheduleMonitorOrCreate(institutionId);
  const updatePromises = layers.map((layer) => {
    return prisma.scheduleMonitorLayer.updateMany({
      where: {
        monitorId: monitor.id,
        layerId: layer.id,
      },
      data: {
        position: layer.position,
      },
    });
  });

  const monitorLayer = await prisma.$transaction(updatePromises);
  return monitorLayer;
}

export async function getLayersToMonitor(institutionId: string) {
  const monitor = await getScheduleMonitorOrCreate(institutionId);
  const layers = await prisma.scheduleMonitorLayer.findMany({
    where: {
      monitorId: monitor.id,
    },
    select: {
      layerId: true,
      layer: {
        select: {
          name: true,
          displayName: true,
        },
      },
    },
    orderBy: {
      position: "asc",
    },
  });

  return layers;
}
