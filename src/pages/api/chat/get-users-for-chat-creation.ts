import { getAuth } from "@clerk/nextjs/server";
import type { NextApiRequest, NextApiResponse } from "next";
import {
  getCoursesForChatCreation,
  getUsersForChatCreation,
} from "@/src/server/functions/server-chat/chat-search";
import { getCurrentInstitution } from "@/src/server/functions/server-user";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "GET") {
    const search = req.query.search as string;
    const excludeUserIds = req.query.excludeUserIds as string | undefined;
    const userIdsToExclude = excludeUserIds ? excludeUserIds.split(",") : [];

    const user = getAuth(req);
    const userId = user.userId!;

    const institution = await getCurrentInstitution(userId);
    const institutionId = institution!.id!;

    let selection = await getUsersForChatCreation({
      userId,
      search,
      userIdsToExclude,
    });

    if (search) {
      // also include matched courses
      const courses = await getCoursesForChatCreation(
        userId,
        institutionId,
        search,
      );

      selection = selection.concat(courses);

      selection.sort((a, b) => {
        // all courses go to top
        if (a.email?.startsWith("course") || b.email?.startsWith("course"))
          return -1;

        // preserve order but put unregistered users last
        if (!a.disabled && !b.disabled) return 0;
        if (!a.disabled) return -1;
        return 1;
      });
    } else {
      // if there is no search return only users that are registered
      selection = selection.filter((i) => !i.disabled);
    }

    res.json(selection);
  }
}
