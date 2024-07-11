import { useEffect } from "react";
import courseGoalHandler from "@/src/client-functions/client-course-goals";
import { useAsyncData } from "@/src/client-functions/client-utils/hooks";
import useUser from "@/src/zustand/user";
import Box from "../../reusable/box";
import useCourse, { CoursePage } from "../zustand";
import CourseManagementChat from "./chat";
import CourseEducatorsTable from "./educator";
import GoalAttendence from "./goals/goal-attendence";
import GoalContent from "./goals/goal-content";
import CourseUsersTable from "./users";
import useCourseManagement from "./zustand";

export default function CourseManagement() {
  const { user } = useUser();
  const { refresh, setAttendence, setPoints, setRefresh } =
    useCourseManagement();
  const { course, page } = useCourse();
  const layerId = course!.layer_id;

  const { data, loading } = useAsyncData(
    () => courseGoalHandler.get.courseGoals(layerId),
    layerId,
  );

  const isLobbyEnabled =
    user.institution?.institutionSettings.communication_course_chat;

  useEffect(() => setRefresh(refresh + 1), [layerId]);
  useEffect(() => {
    if (data) {
      setAttendence(data.attendanceGoal);
      setPoints(data.points);
    } else {
      setAttendence(0);
      setPoints(0);
    }
  }, [data, loading]);

  return (
    <div className="h-full w-full">
      {page === CoursePage.USERS && (
        <>
          <CourseUsersTable layerId={layerId} />
          <CourseEducatorsTable layerId={layerId} />
        </>
      )}
      {page === CoursePage.SETTINGS && (
        <>
          <GoalAttendence layerId={layerId} />
          {isLobbyEnabled && <CourseManagementChat layerId={layerId} />}
          <GoalContent layerId={layerId} />
        </>
      )}
    </div>
  );
}
