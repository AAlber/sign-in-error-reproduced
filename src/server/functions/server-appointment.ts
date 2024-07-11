import axios from "axios";
import { rrulestr } from "rrule";
import { env } from "@/src/env/server.mjs";
import type { IcsEmailData } from "@/src/pages/api/email/send-ics-email";
import type {
  AppointmentData,
  OrganizerData,
  ScheduleAppointment,
  UpdateAppointmentData,
  UpdateAppointmentSeriesData,
} from "@/src/types/appointment.types";
import cacheHandler from "@/src/utils/cache-handler/cache-redis-handler";
import { prisma } from "../db/client";
import { sentry } from "../singletons/sentry";
import { getSettingValues } from "./server-institution-settings";
import { getUserGroupsOfInstitutionForUser } from "./server-institution-user-group";
import { getRoles, getUsersWithAccess } from "./server-role";

export async function createAppointment(
  data: AppointmentData,
  userId: string,
  institutionId: string,
): Promise<ScheduleAppointment[]> {
  const appointments = await prisma.appointment.create({
    data: {
      title: data.title,
      notes: data.notes,
      dateTime: data.dateTime,
      duration: data.duration,
      isOnline: data.isOnline,
      isHybrid: data.isHybrid,
      onlineAddress: data.onlineAddress,
      address: data.address,
      provider: data.provider,
      roomId: data.roomId,
      appointmentCreator: {
        create: {
          userId,
          institutionId,
        },
      },
      appointmentLayers: {
        createMany: {
          data: data.layerIds.map((layerId) => ({
            layerId: layerId,
          })),
        },
      },
      organizerUsers: {
        createMany: {
          data: data.organizerIds.map((organizerId) => ({
            organizerId: organizerId,
            institutionId,
          })),
        },
      },
      appointmentUsers: {
        createMany: {
          data: data.userAttendeeIds.map((userId) => ({
            userId,
            institutionId,
          })),
        },
      },
      appointmentUserGroups: {
        createMany: {
          data: data.userGroupAttendeeIds.map((userGroupId) => ({
            userGroupId,
          })),
        },
      },
    },
    include: {
      appointmentLayers: {
        include: {
          layer: true,
          course: true,
        },
      },
      room: true,
      organizerUsers: {
        select: {
          organizerId: true,
        },
      },
      series: true,
      appointmentUsers: {
        include: {
          user: true,
        },
      },
      appointmentCreator: {
        include: {
          user: true,
        },
      },
      appointmentUserGroups: {
        include: {
          userGroup: true,
        },
      },
    },
  });

  await cacheHandler.invalidate.many(
    "course-upcoming-appointments",
    data.layerIds,
  );

  return [appointments];
}

export async function createAppointmentSeries(
  data: AppointmentData & { rRule: string },
  creatorId: string,
  institutionId: string,
): Promise<ScheduleAppointment[]> {
  const series = await prisma.appointmentSeries.create({
    data: {
      rrule: data.rRule,
    },
  });

  const rrule = rrulestr(data.rRule);
  const dates = rrule.all();
  const appointments = await Promise.all(
    dates.map(async (date) => {
      const appointment = await prisma.appointment.create({
        data: {
          dateTime: date,
          seriesId: series.id,
          title: data.title,
          notes: data.notes,
          duration: data.duration,
          isOnline: data.isOnline,
          isHybrid: data.isHybrid,
          provider: data.provider,
          address: data.address,
          onlineAddress: data.onlineAddress,
          roomId: data.roomId,
          appointmentCreator: {
            create: {
              userId: creatorId,
              institutionId,
            },
          },
          organizerUsers: {
            createMany: {
              data: data.organizerIds.map((organizerId) => ({
                organizerId: organizerId,
                institutionId,
              })),
            },
          },
          appointmentLayers: {
            createMany: {
              data: data.layerIds.map((layerId) => ({
                layerId: layerId,
              })),
            },
          },
          appointmentUsers: {
            createMany: {
              data: data.userAttendeeIds.map((userId) => ({
                userId,
                institutionId,
              })),
            },
          },
          appointmentUserGroups: {
            createMany: {
              data: data.userGroupAttendeeIds.map((userGroupId) => ({
                userGroupId,
              })),
            },
          },
        },
        include: {
          room: true,
          organizerUsers: {
            select: {
              organizerId: true,
            },
          },
          series: true,
          appointmentLayers: {
            include: {
              layer: true,
              course: true,
            },
          },
          appointmentUsers: {
            include: {
              user: true,
            },
          },
          appointmentCreator: {
            include: {
              user: true,
            },
          },
          appointmentUserGroups: {
            include: {
              userGroup: true,
            },
          },
        },
      });
      return appointment;
    }),
  );

  await cacheHandler.invalidate.custom({
    prefix: "user-courses-with-progress-data",
    origin: "server/functions/server-appointment.ts (createAppointmentSeries)",
    type: "many",
    searchParam: data.layerIds,
  });
  await cacheHandler.invalidate.many(
    "course-upcoming-appointments",
    data.layerIds,
  );

  return appointments;
}

export async function updateAppointment(
  data: UpdateAppointmentData,
  institutionId: string,
  appointmentHasCreator: boolean,
): Promise<ScheduleAppointment[]> {
  const dataUpdate = {
    title: data.title,
    notes: data.notes,
    dateTime: data.dateTime,
    duration: data.duration,
    isOnline: data.isOnline,
    isHybrid: data.isHybrid,
    address: data.address,
    onlineAddress: data.onlineAddress,
    provider: data.provider,
    roomId: data.roomId,
    organizerUsers: {
      deleteMany: {},
      createMany: {
        data: data.organizerIds.map((organizerId) => ({
          organizerId,
          institutionId,
        })),
      },
    },
    appointmentLayers: {
      deleteMany: {},
      createMany: {
        data: data.layerIds.map((layerId) => ({
          layerId,
        })),
      },
    },
    appointmentUsers: {
      deleteMany: {},
      createMany: {
        data: data.userAttendeeIds.map((uid) => ({
          userId: uid,
          institutionId,
        })),
      },
    },
    appointmentUserGroups: {
      deleteMany: {},
      createMany: {
        data: data.userGroupAttendeeIds.map((id) => ({
          userGroupId: id,
        })),
      },
    },
  };

  if (!appointmentHasCreator) {
    // gets the first admin
    const admin = await getUsersWithAccess({
      layerId: institutionId,
      roleFilter: ["admin"],
    });

    dataUpdate["appointmentCreator"] = {
      create: {
        userId: admin[0]?.id,
      },
    };
  }

  const update = await prisma.appointment.update({
    where: {
      id: data.id,
    },
    data: dataUpdate,
    include: {
      room: true,
      organizerUsers: {
        select: {
          organizerId: true,
        },
      },
      series: true,
      appointmentLayers: {
        include: {
          layer: true,
          course: true,
        },
      },
      appointmentUsers: {
        include: {
          user: true,
        },
      },
      appointmentCreator: {
        include: {
          user: true,
        },
      },
      appointmentUserGroups: {
        include: {
          userGroup: true,
        },
      },
    },
  });
  await cacheHandler.invalidate.many(
    "course-upcoming-appointments",
    data.layerIds,
  );

  //TODO: Send notification
  return [update];
}

export async function updateAppointmentSeries(
  data: UpdateAppointmentSeriesData,
  userId: string,
  institutionId: string,
): Promise<ScheduleAppointment[]> {
  if (!data.seriesId) throw new Error("Series ID not provided");
  if (!data.rRule) throw new Error("RRule not provided");
  const seriesBefore = await prisma.appointmentSeries.findUnique({
    where: { id: data.seriesId },
  });

  if (!seriesBefore) throw new Error("Series not found");
  const newRRule = rrulestr(data.rRule);

  await prisma.appointmentSeries.update({
    where: { id: data.seriesId },
    data: {
      rrule: data.rRule,
    },
  });

  await prisma.appointment.deleteMany({
    where: {
      seriesId: data.seriesId,
    },
  });

  const appointments = await createAppointmentSeries(
    {
      ...data,
      rRule: newRRule.toString(),
    },
    userId,
    institutionId,
  );

  await cacheHandler.invalidate.many(
    "course-upcoming-appointments",
    data.layerIds,
  );

  //TODO: Send notification
  return appointments as ScheduleAppointment[];
}

export async function getAppointment(
  id: string,
): Promise<ScheduleAppointment | null> {
  return await prisma.appointment.findUnique({
    where: {
      id: id,
    },
    include: {
      room: true,
      organizerUsers: {
        select: {
          organizerId: true,
        },
      },
      series: true,
      appointmentLayers: {
        include: {
          layer: true,
          course: true,
        },
      },
      appointmentUsers: {
        include: {
          user: true,
        },
      },
      appointmentCreator: {
        include: {
          user: true,
        },
      },
      appointmentUserGroups: {
        include: {
          userGroup: true,
        },
      },
    },
  });
}

export async function getLayerIdsOfAppointment(id: string) {
  const appointmentLayer = await prisma.appointment.findUnique({
    where: {
      id: id,
    },
    select: {
      appointmentLayers: {
        select: {
          layerId: true,
        },
      },
    },
  });

  if (!appointmentLayer) throw new Error("Appointment not found");
  return appointmentLayer.appointmentLayers.map((layer) => layer.layerId);
}

export async function getAppointmentsOfLayer(layerId: string) {
  return await prisma.appointment.findMany({
    where: {
      appointmentLayers: {
        some: {
          layerId: layerId,
        },
      },
    },
  });
}

export async function getNumberOfTotalAppointmentsOfLayer(layerId: string) {
  return await prisma.appointment.count({
    where: {
      appointmentLayers: {
        some: {
          layerId,
        },
      },
    },
  });
}

export async function getNumberOfUpcomingAppointmentsOfLayer(
  layerId: string,
): Promise<number> {
  return await prisma.appointment.count({
    where: {
      appointmentLayers: {
        some: {
          layerId,
        },
      },
      dateTime: {
        gte: new Date(),
      },
    },
  });
}

export async function getAppointmentsOfRoom(
  roomId: string,
  date: string,
): Promise<ScheduleAppointment[]> {
  return await prisma.appointment.findMany({
    where: {
      roomId: roomId,
      dateTime: {
        gte: new Date(new Date(date).setHours(0, 0, 0, 0)),
        lte: new Date(new Date(date).setHours(23, 59, 59, 999)),
      },
    },
    include: {
      appointmentLayers: {
        include: {
          layer: true,
          course: true,
        },
      },
      room: true,
      organizerUsers: {
        select: {
          organizerId: true,
        },
      },
      appointmentUsers: {
        include: {
          user: true,
        },
      },
      appointmentCreator: {
        include: {
          user: true,
        },
      },
      appointmentUserGroups: {
        include: {
          userGroup: true,
        },
      },
      series: true,
    },
  });
}

export async function getAllAppointmentsUserHasAccessTo(
  userId: string,
  institutionId: string,
  gte: Date,
  lte: Date,
  filteredLayerIds: string[],
): Promise<ScheduleAppointment[]> {
  //Getting all the appointments in layers that user has access in
  const appointmentsInUserLayersRawData = await prisma.role.findMany({
    where: {
      userId,
      institutionId,
      layer: {
        appointmentLayers: {
          some: {
            appointment: {
              dateTime: {
                gte: gte,
                lt: lte,
              },
            },
          },
        },
      },
    },
    select: {
      layer: {
        select: {
          appointmentLayers: {
            select: {
              appointment: {
                include: {
                  appointmentLayers: {
                    include: {
                      layer: true,
                      course: true,
                    },
                  },
                  room: true,
                  organizerUsers: {
                    select: {
                      organizerId: true,
                    },
                  },
                  series: true,
                  appointmentUsers: {
                    include: {
                      user: true,
                    },
                  },
                  appointmentCreator: {
                    include: {
                      user: true,
                    },
                  },
                  appointmentUserGroups: {
                    include: {
                      userGroup: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  // //Getting all the appointments the user has created (user is a creator)
  const appointmentsCreatedByMeRawData =
    await prisma.appointmentCreator.findMany({
      where: {
        userId,
        institutionId,
      },
      select: {
        appointment: {
          include: {
            appointmentLayers: {
              include: {
                layer: true,
                course: true,
              },
            },
            room: true,
            organizerUsers: {
              select: {
                organizerId: true,
              },
            },
            series: true,
            appointmentUsers: {
              include: {
                user: true,
              },
            },
            appointmentCreator: {
              include: {
                user: true,
              },
            },
            appointmentUserGroups: {
              include: {
                userGroup: true,
              },
            },
          },
        },
      },
    });

  const appointmentsIsUserAttendeesRawData =
    await prisma.appointmentUser.findMany({
      where: {
        userId,
        institutionId,
      },
      select: {
        appointment: {
          include: {
            appointmentLayers: {
              include: {
                layer: true,
                course: true,
              },
            },
            room: true,
            organizerUsers: {
              select: {
                organizerId: true,
              },
            },
            series: true,
            appointmentUsers: {
              include: {
                user: true,
              },
            },
            appointmentCreator: {
              include: {
                user: true,
              },
            },
            appointmentUserGroups: {
              include: {
                userGroup: true,
              },
            },
          },
        },
      },
    });

  //Getting all the appointments the user is selected as "organizer" in
  const appointmentsIsOrganizerRawData =
    await prisma.appointmentOrganizer.findMany({
      where: {
        organizerId: userId,
        institutionId,
      },
      select: {
        appointment: {
          include: {
            appointmentLayers: {
              include: {
                layer: true,
                course: true,
              },
            },
            room: true,
            organizerUsers: {
              select: {
                organizerId: true,
              },
            },
            series: true,
            appointmentUsers: {
              include: {
                user: true,
              },
            },
            appointmentCreator: {
              include: {
                user: true,
              },
            },
            appointmentUserGroups: {
              include: {
                userGroup: true,
              },
            },
          },
        },
      },
    });

  //Getting all the appointments of user group(s) that the user is a member of
  const userGroups = await prisma.institutionUserGroup.findMany({
    where: {
      institutionId,
      members: {
        some: {
          userId,
          group: {
            appointmentUserGroups: {
              some: {
                appointment: {
                  dateTime: {
                    gte,
                    lte,
                  },
                },
              },
            },
          },
        },
      },
    },
    select: {
      institution: {
        select: {
          group: {
            select: {
              appointmentUserGroups: {
                include: {
                  appointment: {
                    include: {
                      appointmentLayers: {
                        include: {
                          layer: true,
                          course: true,
                        },
                      },
                      room: true,
                      organizerUsers: {
                        select: {
                          organizerId: true,
                        },
                      },
                      series: true,
                      appointmentUsers: {
                        include: {
                          user: true,
                        },
                      },
                      appointmentCreator: {
                        include: {
                          user: true,
                        },
                      },
                      appointmentUserGroups: {
                        include: {
                          userGroup: true,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  const appointmentsUserLayers = appointmentsInUserLayersRawData
    .map((role) =>
      role.layer.appointmentLayers.map(
        (appointmentLayer) => appointmentLayer.appointment,
      ),
    )
    .flat();

  const appointmentsAsUserAttendees = appointmentsIsUserAttendeesRawData.map(
    (a) => a.appointment,
  );

  const appointmentsAsCreator = appointmentsCreatedByMeRawData.map(
    (a) => a.appointment,
  );

  const appointmentsAsOrganizer = appointmentsIsOrganizerRawData.map(
    (a) => a.appointment,
  );

  const appointmentsAsUserGroupAttendees = userGroups.flatMap((role) =>
    role.institution.group.flatMap((organizedAppointment) =>
      organizedAppointment.appointmentUserGroups.map((ug) => ug.appointment),
    ),
  );

  const filteredAppointments = appointmentsUserLayers.filter((appointment) =>
    appointment.appointmentLayers.some(
      (appointmentLayer) =>
        filteredLayerIds.length === 0 ||
        filteredLayerIds.includes(appointmentLayer.layerId),
    ),
  );
  const mergedAppointments = [
    ...filteredAppointments,
    ...appointmentsAsUserAttendees,
    ...appointmentsAsCreator,
    ...appointmentsAsOrganizer,
    ...appointmentsAsUserGroupAttendees,
  ].filter((appointment) => {
    const appointmentDate = new Date(appointment.dateTime);
    return appointmentDate >= gte && appointmentDate <= lte;
  });

  const uniqueAppointments = mergedAppointments.filter(
    (appointment, index, self) =>
      index === self.findIndex((t) => t.id === appointment.id),
  );

  return uniqueAppointments;
}

export async function searchAllAppointmentsUserHasAccessTo(
  userId: string,
  institutionId: string,
  title: string,
  filteredLayerIds: string[],
  skip: number,
  take: number,
): Promise<{ data: ScheduleAppointment[]; totalCount: number }> {
  const roles = await getRoles(userId, institutionId);
  const ids = roles.map((role) => role.layerId);

  const filteredIds = ids.filter(
    (id) => filteredLayerIds.includes(id) || filteredLayerIds.length === 0,
  );

  const groups = await getUserGroupsOfInstitutionForUser(userId, institutionId);
  const userGroupIds = groups.map((g) => g.id);

  const data = await prisma.appointment.findMany({
    where: {
      OR: [
        {
          appointmentLayers: {
            some: {
              layerId: {
                in: filteredIds,
              },
            },
          },
          title: {
            contains: title,
          },
        },
        {
          appointmentUsers: {
            some: {
              userId: {
                equals: userId,
              },
              institutionId: {
                equals: institutionId,
              },
            },
          },
          title: {
            contains: title,
          },
        },
        {
          appointmentCreator: {
            userId: {
              equals: userId,
            },
            institutionId: {
              equals: institutionId,
            },
          },
          title: {
            contains: title,
          },
        },
        {
          appointmentUserGroups: {
            some: {
              userGroupId: {
                in: userGroupIds,
              },
            },
          },
          title: {
            contains: title,
          },
        },
        {
          organizerUsers: {
            some: {
              organizerId: {
                equals: userId,
              },
              institutionId: {
                equals: institutionId,
              },
            },
          },
          title: {
            contains: title,
          },
        },
      ],
    },
    include: {
      appointmentLayers: {
        include: {
          layer: true,
          course: true,
        },
      },
      room: true,
      organizerUsers: {
        select: {
          organizerId: true,
        },
      },
      series: true,
      appointmentUsers: {
        include: {
          user: true,
        },
      },
      appointmentCreator: {
        include: {
          user: true,
        },
      },
      appointmentUserGroups: {
        include: {
          userGroup: true,
        },
      },
    },
    skip, // Use skip for pagination
    take, // Use take for limiting the number of results
    orderBy: {
      dateTime: "desc",
    },
  });

  const totalCount = await prisma.appointment.count({
    where: {
      appointmentLayers: {
        some: {
          layerId: {
            in: filteredIds,
          },
        },
      },
      title: {
        contains: title,
      },
    },
  });

  return { data, totalCount };
}

export async function getAllUpcomingAppointments(
  userId: string,
  institutionId: string,
  filteredLayerIds: string[],
  skip: number,
  take: number,
) {
  const roles = await getRoles(userId, institutionId);
  const ids = roles.map((role) => role.layerId);
  const filteredIds = ids.filter(
    (id) => filteredLayerIds.includes(id) || filteredLayerIds.length === 0,
  );

  const bufferTime = 60 * 60 * 1000;
  const now = new Date(new Date().getTime() - bufferTime); // Get the current date and time

  const groups = await getUserGroupsOfInstitutionForUser(userId, institutionId);
  const userGroupIds = groups.map((g) => g.id);

  const data = await prisma.appointment.findMany({
    where: {
      OR: [
        {
          appointmentLayers: {
            some: {
              layerId: {
                in: filteredIds,
              },
            },
          },
          dateTime: {
            gte: now,
          },
        },
        {
          appointmentUsers: {
            some: {
              userId: {
                equals: userId,
              },
              institutionId: {
                equals: institutionId,
              },
            },
          },
          dateTime: {
            gte: now,
          },
        },
        {
          appointmentUserGroups: {
            some: {
              userGroupId: {
                in: userGroupIds,
              },
            },
          },
          dateTime: {
            gte: now,
          },
        },
        {
          appointmentCreator: {
            userId: {
              equals: userId,
            },
            institutionId: {
              equals: institutionId,
            },
          },
          dateTime: {
            gte: now,
          },
        },
        {
          organizerUsers: {
            some: {
              organizerId: {
                equals: userId,
              },
              institutionId: {
                equals: institutionId,
              },
            },
          },
          dateTime: {
            gte: now,
          },
        },
      ],
    },
    include: {
      appointmentLayers: {
        include: {
          layer: true,
          course: true,
        },
      },
      room: true,
      organizerUsers: {
        select: {
          organizerId: true,
        },
      },
      appointmentUsers: {
        include: {
          user: true,
        },
      },
      appointmentCreator: {
        include: {
          user: true,
        },
      },
      appointmentUserGroups: {
        include: {
          userGroup: true,
        },
      },
      series: true,
    },
    orderBy: {
      dateTime: "asc", // Order by dateTime in ascending order to get the closest first
    },
    skip,
    take, // Limit to the 10 closest future appointments
  });

  return data;
}

export async function getTotalCountUpcomingAppointments(
  userId: string,
  institutionId: string,
  filteredLayerIds: string[],
) {
  const roles = await getRoles(userId, institutionId);
  const ids = roles.map((role) => role.layerId);
  const filteredIds = ids.filter(
    (id) => filteredLayerIds.includes(id) || filteredLayerIds.length === 0,
  );
  const bufferTime = 60 * 60 * 1000;
  const now = new Date(new Date().getTime() - bufferTime); // Get the current date and time
  // Total count of future appointments

  const groups = await getUserGroupsOfInstitutionForUser(userId, institutionId);
  const userGroupIds = groups.map((g) => g.id);

  const totalCount = await prisma.appointment.count({
    where: {
      OR: [
        {
          appointmentLayers: {
            some: {
              layerId: {
                in: filteredIds,
              },
            },
          },
          dateTime: {
            gte: now,
          },
        },
        {
          appointmentUsers: {
            some: {
              userId: {
                equals: userId,
              },
              institutionId: {
                equals: institutionId,
              },
            },
          },
          dateTime: {
            gte: now,
          },
        },
        {
          appointmentUserGroups: {
            some: {
              userGroupId: {
                in: userGroupIds,
              },
            },
          },
          dateTime: {
            gte: now,
          },
        },
        {
          appointmentCreator: {
            userId: {
              equals: userId,
            },
            institutionId: {
              equals: institutionId,
            },
          },
          dateTime: {
            gte: now,
          },
        },
        {
          organizerUsers: {
            some: {
              organizerId: {
                equals: userId,
              },
              institutionId: {
                equals: institutionId,
              },
            },
          },
          dateTime: {
            gte: now,
          },
        },
      ],
    },
  });

  return totalCount;
}

export async function getAppointmentOrganizers(
  appointmentId: string,
  institutionId: string,
): Promise<OrganizerData[]> {
  const organizers = await prisma.appointmentOrganizer.findMany({
    where: {
      appointmentId,
    },
    select: {
      organizer: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  const organizerDataSettings = await getSettingValues(institutionId, [
    "appointment_organizer_display",
  ]);

  const customDisplayedOrganizerData = organizers.map((organizer) => ({
    id: organizer.organizer.id,
    name: organizer.organizer.name,
    selectedDataForDisplay: organizer.organizer.name,
    email: organizer.organizer.email,
  }));

  if (
    organizerDataSettings.appointment_organizer_display?.id &&
    organizerDataSettings.appointment_organizer_display?.id !== "name" &&
    organizerDataSettings.appointment_organizer_display?.id !== "email"
  ) {
    const customFieldId =
      organizerDataSettings.appointment_organizer_display.id;
    const customValues = await prisma.institutionUserDataFieldValue.findMany({
      where: {
        userId: {
          in: organizers.map((organizer) => organizer.organizer.id),
        },
        fieldId: customFieldId,
      },
      select: {
        userId: true,
        value: true,
      },
    });

    customDisplayedOrganizerData.forEach((organizer) => {
      const customValue = customValues.find((c) => c.userId === organizer.id);
      if (customValue) {
        organizer.selectedDataForDisplay = customValue.value;
      }
    });
  } else {
    if (organizerDataSettings.appointment_organizer_display?.id === "email") {
      customDisplayedOrganizerData.forEach((organizer) => {
        organizer.selectedDataForDisplay = organizer.email;
      });
    }
  }

  return customDisplayedOrganizerData;
}

export async function deleteAppointment(id: string) {
  return await prisma.appointment.delete({
    where: {
      id: id,
    },
  });
}

export async function deleteAppontmentSeries(id: string) {
  const appointments = await prisma.appointment.deleteMany({
    where: {
      seriesId: id,
    },
  });

  const series = await prisma.appointmentSeries.delete({
    where: {
      id: id,
    },
  });

  return { series, appointments };
}

export async function getUpcomingAppointmentsForLayer(
  id: string,
): Promise<ScheduleAppointment[]> {
  const appointments = await prisma.appointment.findMany({
    where: {
      appointmentLayers: {
        some: {
          layerId: id,
        },
      },
    },
    include: {
      room: true,
      organizerUsers: {
        select: {
          organizerId: true,
        },
      },
      series: true,
      appointmentLayers: {
        include: {
          layer: true,
          course: true,
        },
      },
      appointmentUsers: {
        include: {
          user: true,
        },
      },
      appointmentCreator: {
        include: {
          user: true,
        },
      },
      appointmentUserGroups: {
        include: {
          userGroup: true,
        },
      },
    },
    orderBy: {
      dateTime: "asc",
    },
  });

  return appointments;
}

export async function getConflictingAppointmentsAtTime(
  userId: string,
  dateTime: Date,
  durationMinutes: number,
) {
  const newAppointmentStartTime = dateTime;
  const newAppointmentEndTime = new Date(
    dateTime.getTime() + durationMinutes * 60000,
  );

  const appointments = await prisma.appointment.findMany({
    where: {
      organizerUsers: {
        some: {
          organizerId: userId,
        },
      },
      OR: [
        // Appointments that start before the new appointment but end during it
        {
          AND: [
            {
              dateTime: {
                lt: newAppointmentStartTime,
              },
            },
            {
              dateTime: {
                gte: new Date(
                  newAppointmentStartTime.getTime() - durationMinutes * 60000,
                ),
              },
            },
          ],
        },
        // Appointments that start during the new appointment
        {
          dateTime: {
            gte: newAppointmentStartTime,
            lt: newAppointmentEndTime,
          },
        },
        // Appointments that start during and end after the new appointment
        {
          AND: [
            {
              dateTime: {
                gte: newAppointmentStartTime,
                lt: newAppointmentEndTime,
              },
            },
            {
              dateTime: {
                lt: new Date(
                  newAppointmentEndTime.getTime() + durationMinutes * 60000,
                ),
              },
            },
          ],
        },
        // Appointments that start before and end after the new appointment
        {
          dateTime: {
            lt: newAppointmentStartTime,
          },
        },
      ],
    },
  });

  // Filter appointments for conflicts by their end times
  const conflictingAppointments = appointments.filter((appointment) => {
    const appointmentEndTime = new Date(
      appointment.dateTime.getTime() + appointment.duration * 60000,
    );
    return appointmentEndTime.getTime() > newAppointmentStartTime.getTime();
  });

  return conflictingAppointments;
}

export async function isOnlineAppointmentHappeningSoonOrNow(
  appointmentId: string,
) {
  const appointment = await prisma.appointment.findFirst({
    where: {
      id: appointmentId,
      OR: [{ isOnline: true }, { isHybrid: true }],
    },
  });

  if (!appointment) {
    return false;
  }

  const now = new Date();
  const appointmentStart = new Date(appointment.dateTime);
  const appointmentEnd = new Date(
    appointmentStart.getTime() + appointment.duration * 60000,
  );

  // Check if the appointment is currently happening
  const isCurrentlyHappening =
    appointmentStart.getTime() <= now.getTime() &&
    appointmentEnd.getTime() >= now.getTime();

  // Check if the appointment is today
  const isToday =
    appointmentStart.getDate() === now.getDate() &&
    appointmentStart.getMonth() === now.getMonth() &&
    appointmentStart.getFullYear() === now.getFullYear();

  // Check if the appointment is starting soon
  return isCurrentlyHappening || isToday;
}

export async function getUsersWithAccessToAppointment(
  appointmentId: string,
): Promise<(SimpleUser & { role: Role })[]> {
  const layerIds = await getLayerIdsOfAppointment(appointmentId);
  const roles = await prisma.role.findMany({
    where: {
      OR: [
        {
          layerId: { in: layerIds },
        },
        {
          user: {
            appointmentUsers: {
              some: {
                appointmentId: { equals: appointmentId },
              },
            },
          },
        },
        {
          user: {
            InstitutionUserGroupMembership: {
              some: {
                group: {
                  appointmentUserGroups: {
                    some: {
                      appointmentId: { equals: appointmentId },
                    },
                  },
                },
              },
            },
          },
        },
      ],
    },
    select: {
      user: {
        select: {
          id: true,
          name: true,
          image: true,
          email: true,
        },
      },
      role: true,
    },
  });

  const uniqueRoles = roles.filter(
    (role, index, self) =>
      index === self.findIndex((t) => t.user.id === role.user.id),
  );

  return uniqueRoles.map((role) => {
    return {
      ...role.user,
      role: role.role as Role,
    };
  });
}

export const updateAppointmentNotes = async (
  appointmentId: string,
  notes: string,
) => {
  return await prisma.appointment.update({
    where: {
      id: appointmentId,
    },
    data: {
      notes: notes,
    },
  });
};

const axiosInstance = axios.create({
  baseURL: env.SERVER_URL,
  headers: {
    Authorization: `Bearer ${env.FUXAM_SECRET}`,
  },
});

export async function handleEmailNotificationForAppointment(
  data: IcsEmailData,
) {
  try {
    const response = await axiosInstance.post(
      "/api/email/send-ics-email",
      data,
    );
    if (response.status !== 200) {
      throw new Error(response.data.message);
    }
  } catch (error) {
    sentry.captureException(error);
    console.error(error);
  }
}

export const enrichAppointmentsWithOrganizerData = async (
  appointments: ScheduleAppointment[],
  institutionId: string,
) => {
  const appointmentsRecord = await getOrganizersOfAppointments(
    appointments.map((appointment) => appointment.id),
    institutionId,
  );

  const enrichedAppointments = appointments.map((appointment) => ({
    ...appointment,
    organizerData: appointmentsRecord[appointment.id] || [],
  }));
  return enrichedAppointments;
};

export async function getOrganizersOfAppointments(
  appointmentIds: string[],
  institutionId: string,
): Promise<Record<string, OrganizerData[]>> {
  const organizers = await prisma.appointmentOrganizer.findMany({
    where: {
      appointmentId: {
        in: appointmentIds,
      },
    },
    select: {
      appointmentId: true, // Also select the appointmentId
      organizer: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  // Prepare settings for custom display data
  const organizerDataSettings = await getSettingValues(institutionId, [
    "appointment_organizer_display",
  ]);

  let customValues: { userId: string; value: string }[] = [];
  if (
    organizerDataSettings.appointment_organizer_display?.id &&
    organizerDataSettings.appointment_organizer_display?.id !== "name" &&
    organizerDataSettings.appointment_organizer_display?.id !== "email"
  ) {
    const customFieldId =
      organizerDataSettings.appointment_organizer_display.id;
    customValues = await prisma.institutionUserDataFieldValue.findMany({
      where: {
        userId: {
          in: organizers.map((organizer) => organizer.organizer.id),
        },
        fieldId: customFieldId,
      },
      select: {
        userId: true,
        value: true,
      },
    });
  }

  // Initialize the map to group organizers by appointmentId
  const appointmentOrganizerMap: Record<string, OrganizerData[]> = {};

  organizers.forEach(({ appointmentId, organizer }) => {
    if (!appointmentOrganizerMap[appointmentId]) {
      appointmentOrganizerMap[appointmentId] = [];
    }

    let selectedDataForDisplay = organizer.name; // Default display data
    if (organizerDataSettings.appointment_organizer_display?.id === "email") {
      selectedDataForDisplay = organizer.email;
    } else if (customValues.length > 0) {
      const customValue = customValues.find((c) => c.userId === organizer.id);
      if (customValue) {
        selectedDataForDisplay = customValue.value;
      }
    }

    // Push the organized data into the map
    if (appointmentOrganizerMap[appointmentId] !== undefined) {
      appointmentOrganizerMap[appointmentId]!.push({
        name: organizer.name,
        selectedDataForDisplay,
      });
    }
  });

  return appointmentOrganizerMap;
}

export const getUsersWithAvailability = async (
  dateTime: string,
  duration: string,
  institutionId: string,
  search?: string,
) => {
  const date = new Date(dateTime);
  const durationNumber = parseInt(duration);

  const users = await getUsersWithAccess({
    layerId: institutionId,
    search,
  });
  const conflictsPromises = users.map((user) =>
    getConflictingAppointmentsAtTime(user.id, date, durationNumber),
  );
  const conflicts = await Promise.all(conflictsPromises);

  const usersWithAvailability = users.map((user, index) => {
    return {
      type: "user",
      id: user.id,
      name: user.name,
      image: user.image,
      conflicts: conflicts[index]!,
    };
  });

  return usersWithAvailability;
};
