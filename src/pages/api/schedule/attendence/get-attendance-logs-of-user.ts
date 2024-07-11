import { getAuth } from "@clerk/nextjs/server";
import type { Course } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/src/server/db/client";
import { hasRolesInAtLeastOneLayer } from "@/src/server/functions/server-role";
import { getCurrentInstitutionId } from "@/src/server/functions/server-user";
import { respondToPreflightRequest } from "@/src/utils/utils";

export type AppointmentAttendanceUserLog = {
  attended: boolean;
  name: string;
  id: string;
  dateTime: Date;
  duration: number;
  layerName: string;
  layerId: string;
  course: Course;
  isMember: boolean;
  isOrganizer: boolean;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<AppointmentAttendanceUserLog[] | { message: string }>,
) {
  if (req.method === "OPTIONS") return respondToPreflightRequest(req, res);
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    res.status(405).json({ message: "Method Not Allowed" });
    return;
  }

  try {
    const { userId } = getAuth(req);
    const { targetUserId } = req.query;

    const userIdAttendance = targetUserId ? targetUserId : userId;

    if (typeof userIdAttendance !== "string") {
      res.status(400).json({ message: "Invalid target user ID" });
      return;
    }

    const userCurrentInstiId = await getCurrentInstitutionId(userId!);
    if (!userCurrentInstiId) {
      res.status(404).json({ message: "User's institution not found" });
      return;
    }

    if (targetUserId) {
      const hasAccess = await hasRolesInAtLeastOneLayer({
        userId: userId!,
        layerIds: [userCurrentInstiId],
        rolesWithAccess: ["admin", "moderator", "educator"],
      });

      if (!hasAccess) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }
    }

    const institutionId = getCurrentInstitutionId(userIdAttendance);
    if (!institutionId) {
      res.status(404).json({ message: "Target user's institution not found" });
      return;
    }

    const layers = await prisma.role.findMany({
      where: { userId: userIdAttendance, institutionId: userCurrentInstiId },
      select: { role: true, layer: { select: { id: true } } },
    });

    const ids = layers.map((layer) => layer.layer.id);

    const appointments = await prisma.appointment.findMany({
      where: {
        appointmentLayers: { some: { layerId: { in: ids } } },
        dateTime: { lte: new Date() },
      },
      select: {
        id: true,
        title: true,
        dateTime: true,
        duration: true,
        appointmentLayers: {
          select: { layer: { select: { id: true, name: true, course: true } } },
        },
        attendenceLogs: { where: { userId: userIdAttendance } },
        organizerUsers: { select: { organizerId: true } },
      },
    });

    const filteredAppointments = targetUserId
      ? appointments
      : appointments.filter((a) => a.attendenceLogs.length > 0); // only gets attended appointments

    const result = filteredAppointments
      .map((appointment) => ({
        attended: appointment.attendenceLogs.some((log) => log.attended),
        name: appointment.title,
        layerName: appointment.appointmentLayers[0]?.layer.name ?? "",
        layerId: appointment.appointmentLayers[0]?.layer.id ?? "",
        course:
          appointment.appointmentLayers[0]?.layer.course ?? ({} as Course),
        id: appointment.id,
        dateTime: appointment.dateTime,
        duration: appointment.duration,
        isMember: appointment.appointmentLayers.every((t) =>
          layers.some((l) => l.layer.id === t.layer.id && l.role === "member"),
        ),
        isOrganizer: appointment.organizerUsers.some(
          (t) => t.organizerId === userIdAttendance,
        ),
        firstAttendedAt: appointment.attendenceLogs.find(
          (a) => a.userId === userId,
        )?.firstAttendedAt,
        attendingType: appointment.attendenceLogs.find(
          (a) => a.userId === userId,
        )?.attendingType,
      }))
      .sort((a, b) => b.dateTime.getTime() - a.dateTime.getTime());
    console.log(result);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
