import api from "@/src/pages/api/api";
import type { CopyLayerContentToAnotherLayerArgs } from "@/src/types/server/course.types";
import useCourse from "../../course/zustand";
import { toast } from "../../reusable/toaster/toast";

export async function searchCourseUserHasSpecialAccessTo(search: string) {
  const response = await fetch(
    api.searchCoursesUserHasAccessTo + "x?search=" + search,
    {
      method: "GET",
    },
  );

  const course = (await response.json()) as CoursesUserHasSpecialAccessTo[];
  const courseList = course.map<CoursesUserHasSpecialAccessTo>((c) => ({
    ...c,
    id: c.layer_id ?? "",
  }));

  return courseList;
}

export async function importCourseDataFromCourse(
  args: CopyLayerContentToAnotherLayerArgs,
) {
  const { refreshCourse, course } = useCourse.getState();
  const response = await fetch(api.importDataFromOtherCourse, {
    method: "POST",
    body: JSON.stringify(args),
  });
  if (!response.ok) {
    toast.responseError({
      response,
      title: "toast.import_course_data_error2",
    });
    throw response;
  }
  const currentCount = course.totalContentBlockCount;
  useCourse.setState({
    course: {
      ...course,
      totalContentBlockCount:
        (currentCount || 0) + args.selectedContentBlockIds.length,
    },
  });
  refreshCourse();
  return;
}
