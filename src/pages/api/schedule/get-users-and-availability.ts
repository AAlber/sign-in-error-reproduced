import { getAuth } from "@clerk/nextjs/server";
import type { NextApiRequest, NextApiResponse } from "next";
import { getConflictingAppointmentsAtTime } from "@/src/server/functions/server-appointment";
import { getUsersWithAccess } from "@/src/server/functions/server-role";
import { getCurrentInstitutionId } from "@/src/server/functions/server-user";
import type { UserWithAvailability } from "@/src/types/user-management.types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "GET") {
    const datetime = req.query.dateTime as string;
    const duration = req.query.duration as string;
    const search = req.query.search as string;

    if (!datetime)
      return res.status(400).json({ message: "No datetime provided" });
    if (!duration)
      return res.status(400).json({ message: "No duration provided" });

    const { userId } = getAuth(req);
    const institutionId = await getCurrentInstitutionId(userId!);
    if (!institutionId)
      return res.status(400).json({ message: "No institutionId found" });

    const date = new Date(datetime);
    const durationNumber = parseInt(duration);

    const users = await getUsersWithAccess({
      layerId: institutionId,
      search,
    });
    const conflictsPromises = users.map((user) =>
      getConflictingAppointmentsAtTime(user.id, date, durationNumber),
    );
    const conflicts = await Promise.all(conflictsPromises);

    const usersWithAvailability: UserWithAvailability[] = users.map(
      (user, index) => {
        return {
          ...user,
          conflicts: conflicts[index]!,
        };
      },
    );

    res.json(usersWithAvailability);
  }
}
