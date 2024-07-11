import { getAuth } from "@clerk/nextjs/server";
import type { NextApiRequest, NextApiResponse } from "next";
import {
  getCourseGoalByLayerId,
  getCourseGoalContentBlocksByLayerId,
  getUserAttendenceAndGoalStatus,
} from "@/src/server/functions/server-course-goals";
import { getOverwrittenUserStatuses } from "@/src/server/functions/server-course-overwritten-user-status";
import { isValidCuid } from "@/src/server/functions/server-input";
import {
  getUsersWithAccess,
  isAdminModeratorOrEducator,
} from "@/src/server/functions/server-role";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "GET") {
    try {
      const layerId = req.query.layerId as string;
      const { userId } = getAuth(req);

      if (!isValidCuid(layerId))
        return res.status(400).json({ message: "Invalid id" });
      if (
        !isAdminModeratorOrEducator({
          userId: userId!,
          layerId: layerId,
        })
      )
        return res.status(401).json({ message: "Unauthorized" });

      const { blocks, goal, members, overwrittenStatuses } =
        await getMembersAndCourseGoalOfCourse(layerId);

      const attendanceAndGoalStatusPromise = members.map((member) =>
        getUserAttendenceAndGoalStatus(layerId, member.id, goal, blocks),
      );

      const attendanceAndGoalStatus = await Promise.all(
        attendanceAndGoalStatusPromise,
      );

      const usersWithAttendence = members.map((member, index) => {
        return {
          ...member,
          attendanceStatus: attendanceAndGoalStatus[index]?.attendence || {
            percentage: 0,
            attendedAppointmentsCount: 0,
            totalAppointmentsCount: 0,
            appointmentsInFutureCount: 0,
            isRateSufficient: false,
          },
          prerequisitesStatus: attendanceAndGoalStatus[index]?.goalStatus || [],
        };
      });

      const courseUsers: CourseMember[] = usersWithAttendence.map((user) => {
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          layerId: layerId,
          attendanceStatus: user.attendanceStatus,
          prerequisitesStatus: user.prerequisitesStatus,
          overwrittenStatus: overwrittenStatuses.find(
            (status) => status.userId === user.id,
          ),
        };
      });

      res.json(courseUsers);
    } catch (e) {
      console.log(e);
    }
  }
}

export async function getMembersAndCourseGoalOfCourse(layerId: string) {
  const [members, goal, blocks, overwrittenStatuses] = await Promise.all([
    getUsersWithAccess({ layerId, roleFilter: ["member"] }),
    getCourseGoalByLayerId({ layerId }),
    getCourseGoalContentBlocksByLayerId({ layerId }),
    getOverwrittenUserStatuses(layerId),
  ]);

  return {
    members,
    goal,
    blocks,
    overwrittenStatuses,
  };
}
