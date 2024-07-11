import * as Sentry from "@sentry/nextjs";
import type { NextApiRequest, NextApiResponse } from "next";
import { getUpcomingAppointmentsForLayer } from "@/src/server/functions/server-appointment";
import type { ScheduleAppointment } from "@/src/types/appointment.types";
import cacheHandler from "@/src/utils/cache-handler/cache-redis-handler";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<
    { appointments: ScheduleAppointment[] } | { message: string }
  >,
) {
  if (req.method !== "GET") return res.status(405).end();

  try {
    if (!req.headers.authorization) {
      Sentry.addBreadcrumb({
        message: "Missing authorization token",
      });
      return res.status(401).send({ message: "No authorization token" });
    }

    if (req.headers.authorization !== "Bearer " + process.env.FUXAM_SECRET) {
      Sentry.addBreadcrumb({
        message: "Missing authorization token",
      });
      return res.status(401).send({ message: "Invalid authorization token" });
    }

    const layerId = req.query.layerId as string;
    Sentry.addBreadcrumb({
      message: `Fetching appointments for layerId: ${layerId}`,
    });

    const appointments = await getUpcomingAppointmentsForLayer(layerId);

    Sentry.addBreadcrumb({
      message: "Caching response...",
    });

    await cacheHandler.set("course-upcoming-appointments", layerId, {
      appointments,
    });

    return res.json({ appointments });
  } catch (e) {
    const err = e as Error;
    Sentry.captureException(err);
    res.status(500).json({ message: err.message });
  }
}
