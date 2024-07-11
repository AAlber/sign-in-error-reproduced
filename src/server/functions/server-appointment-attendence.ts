import type {
  AppointmentAttendenceKey,
  AppointmentAttendenceLog,
} from "@prisma/client";
import { prisma } from "../db/client";
import {
  getAppointment,
  getUsersWithAccessToAppointment,
} from "./server-appointment";
import { getUserGroupsOfInstitutionForUser } from "./server-institution-user-group";

export async function generateAppointmentAttendenceKey(
  appointmentId: string,
): Promise<AppointmentAttendenceKey> {
  try {
    const key = await prisma.appointmentAttendenceKey.create({
      data: {
        appointmentId: appointmentId,
      },
    });
    return key;
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === "P2002") {
      throw new Error("Attendance key already exists for this appointment.");
    }
    console.error("Error generating appointment attendance key:", error);
    throw new Error("Unable to generate attendance key.");
  }
}

export async function getAppointmentAttendenceKey(appointmentId: string) {
  try {
    let attendenceKey = await prisma.appointmentAttendenceKey.findUnique({
      where: {
        appointmentId: appointmentId,
      },
    });

    if (!attendenceKey) {
      attendenceKey = await generateAppointmentAttendenceKey(appointmentId);
      console.log("Generated new attendance key:", attendenceKey);
    } else {
      console.log("Found attendance key:", attendenceKey);
    }

    return attendenceKey;
  } catch (error) {
    console.error("Error fetching attendance key:", error);
    throw new Error("Unable to fetch or create attendance key.");
  }
}

export async function createAppointmentAttendenceLog(
  userId: string,
  appointmentId: string,
): Promise<AppointmentAttendenceLog> {
  try {
    const log = await prisma.appointmentAttendenceLog.create({
      data: {
        userId: userId,
        appointmentId: appointmentId,
      },
    });
    return log;
  } catch (error) {
    console.error("Error creating appointment attendance log:", error);
    throw new Error("Unable to create attendance log.");
  }
}

export async function updateAppointmentAttendenceLogWithFirstAttendedTimestamp(
  userId: string,
  appointmentId: string,
  attended: boolean,
  isOnline: boolean,
): Promise<AppointmentAttendenceLog> {
  try {
    const log = await getAppointmentAttendenceLog(userId, appointmentId);
    const updatedLog = await prisma.appointmentAttendenceLog.update({
      where: {
        id: log.id,
      },
      data: {
        attended: attended,
        attendingType: !!isOnline ? "online" : "in-person",
        firstAttendedAt: log.firstAttendedAt ? log.firstAttendedAt : new Date(),
      },
    });
    return updatedLog;
  } catch (error) {
    console.error(
      "Error updating appointment attendance log with first attended timestamp:",
      error,
    );
    throw new Error(
      "Unable to update attendance log with first attended timestamp.",
    );
  }
}

export async function updateAppointmentAttendenceLog(
  userId: string,
  appointmentId: string,
  attended: boolean,
  isOnline: boolean,
): Promise<AppointmentAttendenceLog> {
  try {
    const log = await getAppointmentAttendenceLog(userId, appointmentId);
    const updatedLog = await prisma.appointmentAttendenceLog.update({
      where: {
        id: log.id,
      },
      data: {
        attended: attended,
        attendingType: !!isOnline ? "online" : "in-person",
      },
    });
    return updatedLog;
  } catch (error) {
    console.error("Error updating appointment attendance log:", error);
    throw new Error("Unable to update attendance log.");
  }
}

export async function getAppointmentAttendenceLog(
  userId: string,
  appointmentId: string,
): Promise<AppointmentAttendenceLog> {
  try {
    let attendenceLog = await prisma.appointmentAttendenceLog.findFirst({
      where: {
        userId: userId,
        appointmentId: appointmentId,
      },
    });

    if (!attendenceLog) {
      attendenceLog = await createAppointmentAttendenceLog(
        userId,
        appointmentId,
      );
    }

    return attendenceLog;
  } catch (error) {
    console.error("Error fetching attendance log:", error);
    throw new Error("Unable to fetch or create attendance log.");
  }
}

export async function getAppointmentAttendeneLogsOfUsers(
  userIds: string[],
  appointmentId: string,
): Promise<AppointmentAttendenceLog[]> {
  try {
    const attendenceLogs = await prisma.appointmentAttendenceLog.findMany({
      where: {
        userId: {
          in: userIds,
        },
        appointmentId: appointmentId,
      },
    });

    return attendenceLogs;
  } catch (error) {
    console.error("Error fetching attendance logs for users:", error);
    throw new Error("Unable to fetch attendance logs.");
  }
}

export async function getAllAttendenceLogsFromAppointment(
  appointmentId: string,
) {
  try {
    const usersWithAccess =
      await getUsersWithAccessToAppointment(appointmentId);
    const attendenceLogs = await prisma.appointmentAttendenceLog.findMany({
      where: {
        appointmentId: appointmentId,
        userId: {
          in: usersWithAccess
            .filter((user) => user.role === "member")
            .map((user) => user.id),
        },
      },
      include: {
        user: true,
      },
    });

    // if the user is not already in the attendence logs add them with attended: false
    const usersNotInAttendenceLogs = usersWithAccess.filter((user) => {
      return !attendenceLogs.some((log) => {
        return log.userId === user.id;
      });
    });

    const attendenceLogsOfUsersNotInAttendenceLogs = usersNotInAttendenceLogs
      .filter((user) => user.role === "member")
      .map((user) => {
        return {
          attended: false,
          ...user,
        };
      });

    const data = [
      ...attendenceLogs.map((log) => {
        if (!log.user) return;
        return {
          ...log.user,
          attended: log.attended,
          attendingType: log.attendingType,
          firstAttendedAt: log.firstAttendedAt,
        };
      }),
      ...attendenceLogsOfUsersNotInAttendenceLogs,
    ];

    // sort attended false first AND sort by name
    const sortedData = data
      .filter((log) => log !== undefined)
      .sort((a, b) => {
        if (a!.attended === b!.attended) {
          return a!.name.localeCompare(b!.name);
        }
        return a!.attended ? 1 : -1;
      });

    return sortedData;
  } catch (error) {
    console.error("Error fetching attendance logs for users:", error);
    throw new Error("Unable to fetch attendance logs.");
  }
}

export const isAppointmentCreatorOrOrganizer = async (
  appointmentId: string,
  userId: string,
) => {
  try {
    const appointment = await getAppointment(appointmentId.toString());
    if (!appointment) {
      throw new Error(`Appointment with id ${appointmentId} is not found.`);
    }
    const isCreator = appointment.appointmentCreator?.userId === userId;
    const isOrganizer = appointment.organizerUsers.some(
      (u) => u.organizerId === userId,
    );

    const isCreatorOrOrganizer = isCreator || isOrganizer;
    return isCreatorOrOrganizer;
  } catch (error) {
    console.error("Error fetching appointment data:", error);
    return false;
  }
};

export const isAppointmentCreatorOrganizerorAttendee = async (
  appointmentId: string,
  userId: string,
  institutionId: string,
) => {
  try {
    const appointment = await getAppointment(appointmentId);
    if (!appointment) {
      throw new Error(`Appointment with id ${appointmentId} is not found.`);
    }
    const isCreator = appointment.appointmentCreator?.userId === userId;
    const isOrganizer = appointment.organizerUsers.some(
      (u) => u.organizerId === userId,
    );
    const isUserAttendee = appointment.appointmentUsers.some(
      (u) => u.userId === userId,
    );
    const allUserGroupsAttendeesIds = appointment.appointmentUserGroups.map(
      (ug) => ug.userGroupId,
    );
    const userGroupIds = (
      await getUserGroupsOfInstitutionForUser(userId, institutionId)
    ).map((u) => u.id);

    const isUserGroupAttendee = userGroupIds.some((id) =>
      allUserGroupsAttendeesIds.includes(id),
    );

    const isCreatorOrOrganizerOrAttendee =
      isCreator || isOrganizer || isUserAttendee || isUserGroupAttendee;

    return isCreatorOrOrganizerOrAttendee;
  } catch (error) {
    console.error("Error fetching appointment data:", error);
    return false;
  }
};
