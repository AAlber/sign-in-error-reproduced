import dayjs from "dayjs";
import type {
  RequestUnavailablities,
  TimeFrame,
} from "@/src/types/planner/planner.types";
import { log } from "@/src/utils/logger/logger";
import { prisma } from "../../db/client";

export function getFutureUnavailableTimeSlots(data: RequestUnavailablities) {
  log.info("getFutureAppointments", data);
  switch (data.type) {
    case "layer":
      return getFutureUnavailableTimeSlotsOfLayer(data.id);
    case "room":
      return getFutureUnavailableTimeSlotsOfRoom(data.id);
    case "organizer":
      return getFutureUnavailableTimeSlotsOfOrganizer(data.id);
    default:
      throw new Error(
        "Invalid type for fetching unavailabilities (" + data.type + ")",
      );
  }
}

function formatAppointmentsToTimeSlots(
  appointments: { dateTime: Date; duration: number }[],
): TimeFrame[] {
  log.info("Formating appointments to time slots...");
  try {
    return appointments
      .sort((a, b) => a.dateTime.getTime() - b.dateTime.getTime())
      .map((appointment) => ({
        start: dayjs(appointment.dateTime, { utc: true }).toDate(),
        end: dayjs(appointment.dateTime, { utc: true })
          .add(appointment.duration, "minutes")
          .toDate(),
      }));
  } catch (error) {
    log.error(error);
    return [];
  }
}

async function getFutureUnavailableTimeSlotsOfLayer(
  id: string,
): Promise<TimeFrame[]> {
  log.info("Getting future unavailable time slots of layer...", id);
  const layerAppointments = await prisma.layer.findUniqueOrThrow({
    where: {
      id: id,
    },
    select: {
      appointmentLayers: {
        select: {
          layer: true,
          course: true,
          appointment: {
            select: {
              dateTime: true,
              duration: true,
            },
          },
        },
      },
    },
  });

  return formatAppointmentsToTimeSlots(
    layerAppointments.appointmentLayers
      .map((appointment) => appointment.appointment)
      .filter(
        (appointment) =>
          appointment.dateTime >= dayjs().hour(0).minute(0).toDate(),
      ),
  );
}

async function getFutureUnavailableTimeSlotsOfRoom(
  id: string,
): Promise<TimeFrame[]> {
  log.info("Getting future unavailable time slots of room...", id);
  const roomAppointments = await prisma.institutionRoom.findMany({
    where: {
      id,
      appointments: {
        some: {
          dateTime: {
            gte: dayjs().hour(0).minute(0).toDate(),
          },
        },
      },
    },
    select: {
      id: true,
      name: true,
      appointments: {
        where: {
          dateTime: {
            gte: dayjs().hour(0).minute(0).toDate(),
          },
        },
        select: {
          dateTime: true,
          duration: true,
        },
      },
    },
  });

  return formatAppointmentsToTimeSlots(
    roomAppointments.flatMap((room) => room.appointments),
  );
}

async function getFutureUnavailableTimeSlotsOfOrganizer(
  id: string,
): Promise<TimeFrame[]> {
  log.info("Getting future unavailable time slots of organizer...", id);
  const organizerAppointments = await prisma.appointment.findMany({
    where: {
      organizerUsers: {
        some: {
          organizerId: id,
        },
      },
      dateTime: {
        gte: dayjs().hour(0).minute(0).toDate(),
      },
    },
    select: {
      organizerUsers: {
        select: {
          organizerId: true,
          organizer: {
            select: {
              name: true,
            },
          },
        },
      },
      dateTime: true,
      duration: true,
    },
  });

  return formatAppointmentsToTimeSlots(
    organizerAppointments.map((appointment) => appointment),
  );
}
