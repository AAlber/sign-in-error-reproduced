import { format, utcToZonedTime } from "date-fns-tz";
import { prisma } from "@/src/server/db/client";
import { getCurrentInstitutionId } from "@/src/server/functions/server-user";

export type ConciergeContext = {
  timeZone: string;
};

type ConciergeAppointment = {
  title: string;
  coursesThatHaveThisAppointment: string[];
  dateTime: string;
  duration: number;
  type: "In person event" | "Online event";
  room?:
    | {
        name: string;
        address: string;
      }
    | null
    | undefined;
  url?: string;
};

export async function getNextAppointments(
  userId: string,
  context: ConciergeContext,
) {
  const institutionId = await getCurrentInstitutionId(userId);
  if (!institutionId) {
    return [];
  }
  const roles = await prisma.role.findMany({
    where: {
      userId: userId,
      institutionId: institutionId,
    },
    select: {
      layerId: true,
    },
  });

  if (roles.length === 0) {
    return [];
  }

  const appointments = await prisma.appointment.findMany({
    where: {
      appointmentLayers: {
        some: {
          layerId: {
            in: roles.map((role) => role.layerId),
          },
        },
      },
      dateTime: {
        gte: new Date(),
      },
    },
    select: {
      title: true,
      appointmentLayers: {
        select: {
          layer: {
            select: {
              name: true,
            },
          },
        },
      },
      isOnline: true,
      address: true,
      dateTime: true,
      duration: true,
      room: {
        select: {
          name: true,
          address: true,
        },
      },
    },
  });

  const formattedAppointments = appointments.map((appointment) => {
    const zonedTime = utcToZonedTime(appointment.dateTime, context.timeZone);
    const targetTime = format(zonedTime, "dd MMM yyyy - HH:mm", {
      timeZone: context.timeZone,
    });

    if (!appointment.isOnline) {
      return {
        title: appointment.title,
        coursesThatHaveThisAppointment: appointment.appointmentLayers.map(
          (appointmentLayer) => appointmentLayer.layer.name,
        ),
        // convert to user's timezone
        dateTime: targetTime,
        duration: appointment.duration,
        type: "In person event",
        room: appointment.room,
      };
    } else {
      return {
        title: appointment.title,
        coursesThatHaveThisAppointment: appointment.appointmentLayers.map(
          (appointmentLayer) => appointmentLayer.layer.name,
        ),
        // convert to user's timezone
        dateTime: targetTime,
        duration: appointment.duration,
        type: "Online event",
        url: appointment.address,
      };
    }
  });

  // sort newest to oldest and return the first 5
  const filteredAppointments = formattedAppointments
    .sort((a, b) => {
      return new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime();
    })
    .slice(0, 10);

  return filteredAppointments;
}

export async function getAppointmentsOfUserInTimeSpan(
  userId: string,
  context: ConciergeContext,
  start: Date,
  end: Date,
): Promise<ConciergeAppointment[]> {
  const institutionId = await getCurrentInstitutionId(userId);
  if (!institutionId) {
    return [];
  }
  const roles = await prisma.role.findMany({
    where: {
      userId: userId,
      institutionId: institutionId,
    },
    select: {
      layerId: true,
    },
  });

  if (roles.length === 0) {
    return [];
  }

  const startAdjustedHoursToZero = new Date(start.setHours(0, 0, 0, 0));
  const endAdjustedHoursToZero = new Date(end.setHours(23, 59, 59, 999));

  const appointments = await prisma.appointment.findMany({
    where: {
      appointmentLayers: {
        some: {
          layerId: {
            in: roles.map((role) => role.layerId),
          },
        },
      },
      dateTime: {
        gte: startAdjustedHoursToZero,
        lt: endAdjustedHoursToZero,
      },
    },
    select: {
      title: true,
      appointmentLayers: {
        select: {
          layer: {
            select: {
              name: true,
            },
          },
        },
      },
      isOnline: true,
      address: true,
      dateTime: true,
      duration: true,
      room: {
        select: {
          name: true,
          address: true,
        },
      },
    },
  });

  const formattedAppointments: ConciergeAppointment[] = appointments.map(
    (appointment) => {
      const zonedTime = utcToZonedTime(appointment.dateTime, context.timeZone);
      const targetTime = format(zonedTime, "dd MMM yyyy - HH:mm", {
        timeZone: context.timeZone,
      });

      if (!appointment.isOnline) {
        return {
          title: appointment.title,
          coursesThatHaveThisAppointment: appointment.appointmentLayers.map(
            (appointmentLayer) => appointmentLayer.layer.name,
          ),
          // convert to user's timezone
          dateTime: targetTime,
          duration: appointment.duration,
          type: "In person event",
          room: appointment.room,
        } satisfies ConciergeAppointment;
      } else {
        return {
          title: appointment.title,
          coursesThatHaveThisAppointment: appointment.appointmentLayers.map(
            (appointmentLayer) => appointmentLayer.layer.name,
          ),
          // convert to user's timezone
          dateTime: targetTime,
          duration: appointment.duration,
          type: "Online event",
          url: appointment.address,
        } satisfies ConciergeAppointment;
      }
    },
  );

  return formattedAppointments;
}

export async function getTasksOfUser(
  userId: string,
  status: "ALL" | "NOT_STARTED" | "FINISHED" = "ALL",
  dueDate?: string,
) {
  const dueDateFormatted = dueDate ? new Date(dueDate) : undefined;
  console.log("status", status);
  console.log("dueDate", dueDateFormatted);
  const institutionId = await getCurrentInstitutionId(userId);
  if (!institutionId) {
    return [];
  }
  const roles = await prisma.role.findMany({
    where: {
      userId: userId,
      institutionId: institutionId,
      layer: {
        isCourse: true,
      },
    },
    select: {
      layerId: true,
      role: true,
    },
  });

  if (roles.length === 0) {
    return [];
  }

  const contentBlocks = await prisma.contentBlock.findMany({
    where: {
      layerId: {
        in: roles.map((role) => role.layerId),
      },
      status: {
        in: ["PUBLISHED"],
      },
      dueDate: dueDateFormatted ? { lte: dueDateFormatted } : undefined,
    },
    select: {
      name: true,
      type: true,
      description: true,
      dueDate: true,
      startDate: true,
      layer: {
        select: {
          id: true,
          name: true,
        },
      },
      userStatus: {
        where: {
          userId: userId,
        },
        select: {
          status: true,
        },
      },
    },
  });

  const formattedTasks = contentBlocks.map((contentBlock) => {
    return {
      name: contentBlock.name,
      description: contentBlock.description,
      type: contentBlock.type,
      status: contentBlock.userStatus ?? { status: "NOT_STARTED" },
      course: contentBlock.layer.name,
      linkToCourse: `${process.env.SERVER_URL}/?page=COURSES&tab=${contentBlock.layer.id}`,
    };
  });

  return formattedTasks;
}
