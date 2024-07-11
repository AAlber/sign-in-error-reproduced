import type { InstitutionRoomWithAppointments } from "@/src/types/appointment.types";
import { prisma } from "../db/client";

export async function createInstitutionRoom(
  name: string,
  institutionId: string,
  personCapacity: number,
  address: string,
  addressNotes: string,
  amenities: string,
) {
  return await prisma.institutionRoom.create({
    data: {
      name: name,
      institutionId: institutionId,
      personCapacity: personCapacity,
      address: address,
      addressNotes: addressNotes,
      amenities: amenities,
    },
  });
}

export async function updateInstitutionRoom(
  id: string,
  name: string,
  institutionId: string,
  personCapacity: number,
  address: string,
  addressNotes: string,
  amenities: string,
) {
  return await prisma.institutionRoom.update({
    where: {
      id: id,
    },
    data: {
      name: name,
      institutionId: institutionId,
      personCapacity: personCapacity,
      address: address,
      addressNotes: addressNotes,
      amenities: amenities,
    },
  });
}

export async function getInstitutionIdOfRoom(id: string) {
  const room = await prisma.institutionRoom.findUnique({
    where: {
      id: id,
    },
    select: {
      institutionId: true,
    },
  });

  if (!room) return null;
  return room.institutionId;
}

export async function getInstitutionRooms(
  institutionId: string,
  search: string,
) {
  return await prisma.institutionRoom.findMany({
    where: {
      institutionId: institutionId,
      name: {
        contains: search,
      },
    },
  });
}

export async function getInstitutionRoomsFromIds(ids: string[]) {
  return await prisma.institutionRoom.findMany({
    where: {
      id: {
        in: ids,
      },
    },
  });
}

export async function getInstitutionRoomsWithAppointments(
  institutionId: string,
): Promise<InstitutionRoomWithAppointments[]> {
  return await prisma.institutionRoom.findMany({
    where: {
      OR: [
        {
          institutionId: institutionId,
        },
      ],
    },
    include: {
      appointments: true,
    },
  });
}

export async function deleteInstitutionRoom(id: string, institutionId: string) {
  return await prisma.institutionRoom.deleteMany({
    where: {
      id: id,
      institutionId: institutionId,
    },
  });
}

export async function deleteInstitutionRooms(ids: string[]) {
  return await prisma.institutionRoom.deleteMany({
    where: {
      id: {
        in: ids,
      },
    },
  });
}

export async function getInstitutionRoomWithAppointments(
  institutionRoomId: string,
) {
  return await prisma.institutionRoom.findUnique({
    where: {
      id: institutionRoomId,
    },
    include: {
      appointments: true,
    },
  });
}
