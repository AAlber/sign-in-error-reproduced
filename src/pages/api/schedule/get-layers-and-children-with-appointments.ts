import { getAuth } from "@clerk/nextjs/server";
import dayjs from "dayjs";
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/src/server/db/client";
import { getChildrenIdsOfLayer } from "@/src/server/functions/server-administration";
import { enrichAppointmentsWithOrganizerData } from "@/src/server/functions/server-appointment";
import { hasRolesWithAccess } from "@/src/server/functions/server-role";
import { getCurrentInstitutionId } from "@/src/server/functions/server-user";
import type { ScheduleAppointment } from "@/src/types/appointment.types";
import { HttpError } from "@/src/utils/exceptions/http-error";
import { log } from "@/src/utils/logger/logger";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    if (req.method !== "GET") throw new HttpError("Invalid Method", 400);

    const layerIds = req.query.layerIds as string;
    const date = req.query.date as string;

    const user = getAuth(req);
    const userId = user.userId!;
    const institutionId = await getCurrentInstitutionId(userId!);

    if (!layerIds) throw new HttpError("No ids provided", 400);
    if (!institutionId) throw new HttpError("No institutionId found", 400);

    const hasAccess = await hasRolesWithAccess({
      layerIds: [institutionId],
      userId: userId!,
      rolesWithAccess: ["admin", "moderator", "educator", "member"],
    });

    if (!hasAccess) throw new HttpError("Unauthorized", 401);

    const ids = layerIds.split(",");

    const childrenPromise = ids.map(async (layerId) => {
      const childrenIds = await getChildrenIdsOfLayer(layerId);
      return {
        layerId: layerId,
        childrenIds: childrenIds,
      };
    });

    const children = await Promise.all(childrenPromise);
    const childrenFlat = children.flat();

    const start = dayjs(date).startOf("day").toDate();
    const end = dayjs(date).endOf("day").toDate();

    const appointmentPromise = childrenFlat.map(async (child) => {
      const ids = [child.layerId, ...child.childrenIds];
      const appointments: ScheduleAppointment[] =
        await prisma.appointment.findMany({
          where: {
            appointmentLayers: {
              some: {
                layerId: {
                  in: ids,
                },
              },
            },
            dateTime: {
              gte: start,
              lte: end,
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

      return {
        appointments: appointments,
        originalLayerId: child.layerId,
      };
    });

    const appointments = await Promise.all(appointmentPromise);

    const flatAppointments = appointments.flatMap((appointment) => {
      return appointment.appointments.map((singleAppointment) => {
        return {
          ...singleAppointment,
          originalLayerId: appointment.originalLayerId,
        };
      });
    });

    const appointmentsWithOrganizerData =
      await enrichAppointmentsWithOrganizerData(
        flatAppointments,
        institutionId,
      );

    return res.json(appointmentsWithOrganizerData);
  } catch (e) {
    log.error(e);
    const err = e as HttpError;
    res
      .status(err.status || 500)
      .json({ success: false, message: err.message });
  }
}
