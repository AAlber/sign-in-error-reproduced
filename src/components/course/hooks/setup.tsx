import { useEffect } from "react";
import type { CourseWithDurationAndProgress } from "@/src/types/user.types";
import useSuggestions from "../../dashboard/navigation/primary-sidebar/finder/finder-sections/zustand-suggestions";
import { useCourseTab } from "../courses-tab.zustand";
import useCourse from "../zustand";

const useCourseSetup = (course?: CourseWithDurationAndProgress) => {
  useEffect(
    () => () => {
      // reset courseTabs on page navigate away
      useCourseTab.setState({ courses: [] });
    },
    [],
  );

  useEffect(() => {
    if (!course) return;

    const { addSuggestion } = useSuggestions.getState();
    const { setHasSpecialRole, updateCourse, setcourseTabChangeLoading } =
      useCourse.getState();

    const specialRole = course.role !== "member";
    setHasSpecialRole(specialRole);
    updateCourse(course);
    addSuggestion({
      id: course.layer_id,
      icon: course.icon ?? "",
      name: course.name,
      value: course.name + " " + course.layer_id,
      specialAccess: specialRole,
    });

    const contentBlocksCount =
      course.totalContentBlockCount && course.totalContentBlockCount > 0
        ? course.totalContentBlockCount
        : 0;

    updateCourse({
      ...course,
      totalContentBlockCount: contentBlocksCount,
    });

    setcourseTabChangeLoading(false);
  }, [course?.layer_id]);
};

export default useCourseSetup;
