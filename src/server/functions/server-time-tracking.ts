import type { Appointment, Role } from "@prisma/client";
import type { TimeTrackingData } from "@/src/types/time-tracking.types";
import { prisma } from "../db/client";
import { getRoles } from "./server-role";

export async function getTimeTrackingDataForUser(
  userId: string,
  institutionId: string,
): Promise<TimeTrackingData> {
  const roles = await getRoles(userId, institutionId);

  const appointments = await prisma.appointment.findMany({
    where: {
      appointmentLayers: {
        some: {
          layer: {
            id: {
              in: roles.map((role) => role.layerId),
            },
          },
        },
      },
      dateTime: { lte: new Date() },
    },
    orderBy: {
      dateTime: "desc",
    },
  });

  const timeTrackingData: any = {
    timeAsOrganizer: calculateTimeAsOrganizer(appointments, userId),
    timeAsParticipant: calculateTimeAsParticipant(appointments, userId, roles),
    appointments: await getAllAppointmentsWhereOrganizerOrParticipant(
      appointments,
      userId,
      roles,
    ),
  };

  return timeTrackingData;
}

function calculateTimeAsOrganizer(appointments: any[], userId: string): number {
  let totalDurationInMilliseconds = 0;

  for (let i = 0; i < appointments.length; i++) {
    if (appointments[i].organizerId === userId) {
      // Assuming duration is in minutes
      totalDurationInMilliseconds += appointments[i].duration * 60 * 1000;
    }
  }

  return totalDurationInMilliseconds;
}

function calculateTimeAsParticipant(
  appointments: any[],
  userId: string,
  roles: Role[],
): number {
  let totalDurationInMilliseconds = 0;

  for (let i = 0; i < appointments.length; i++) {
    if (
      appointments[i].organizerId !== userId &&
      roles.some(
        (role) =>
          role.layerId === appointments[i].layerId && role.role === "member",
      )
    ) {
      // Assuming duration is in minutes
      totalDurationInMilliseconds += appointments[i].duration * 60 * 1000;
    }
  }

  return totalDurationInMilliseconds;
}

async function getAllAppointmentsWhereOrganizerOrParticipant(
  appointments: Appointment[],
  userId: string,
  roles: Role[],
) {
  const appointmentsWhereOrganizerOrParticipant = appointments.filter(
    (appointment) => roles.some((role) => role.layerId === ""),
  );

  const appointmentPromises = appointmentsWhereOrganizerOrParticipant.map(
    async (appointment) => {
      return {
        layerPath: "TODO",
        title: appointment.title,
        duration: appointment.duration,
        dateTime: appointment.dateTime,
      };
    },
  );

  const data = await Promise.all(appointmentPromises);
  return data;
}
