import { Shapes } from "lucide-react";
import structureHandler from "@/src/client-functions/client-administration/structure-handler";
import CourseContent from "@/src/components/course";
import CourseToolbar from "@/src/components/course/content-blocks/table/toolbar";
import CourseTile from "@/src/components/course/course-tile";
import CourseTileBox from "@/src/components/course/course-tile/tile-box";
import { useCourseTab } from "@/src/components/course/courses-tab.zustand";
import { CourseSplitScreen } from "@/src/components/course/splitscreen";
import { DriveTypeProvider } from "@/src/components/drive/drive-type-provider";
import { EmptyState } from "@/src/components/reusable/empty-state";
import { SeparatorWithTitle } from "@/src/components/reusable/separator-with-title";
import Skeleton from "@/src/components/skeleton";
import type { CourseWithDurationAndProgress } from "@/src/types/user.types";
import NoCourses from "../../no-courses";
import { PageBuilder } from "../page-registry";

const courses = new PageBuilder("COURSES")
  .withIconComponent(<Shapes size={18} />)
  .withSplitScreenComponent(
    <DriveTypeProvider driveType="course-drive">
      <CourseSplitScreen />
    </DriveTypeProvider>,
  )
  .withNavigationType("with-dynamic-secondary-navigation")
  .withSkeletonComponent(
    <CourseTileBox className="border border-border bg-foreground">
      <Skeleton />
    </CourseTileBox>,
  )
  .withOptions({ hideBarOnLessThanTwoElements: true })
  .withNoTabsAvailableDisclaimer(
    <EmptyState
      icon={Shapes}
      title="dashboard_no_courses_header"
      description="dashboard_no_courses_subtitle"
      className="py-6"
    />,
  )
  .withNoTabSelectedDisclaimer(<NoCourses />)
  .withDynamicSecondaryNavigationElements(async () => {
    const data = await structureHandler.get.userCoursesWithProgressData();
    if (!data) return [];

    const courses = data.courses;

    if (!courses) return [];

    useCourseTab.setState({ courses });

    let tabs: SecondaryNavigationElement[] = [];

    const currentTime = new Date().getTime();
    const ongoingCourses = courses.filter(
      (course) =>
        (!course.start || new Date(course.start).getTime() < currentTime) &&
        (!course.end || new Date(course.end).getTime() > currentTime),
    );
    const notStartedCourses = courses.filter(
      (course) =>
        course.start && new Date(course.start).getTime() > currentTime,
    );
    const endedCourses = courses.filter(
      (course) => course.end && new Date(course.end).getTime() < currentTime,
    );
    const createTabsForCourses = (
      courses: CourseWithDurationAndProgress[],
      disabled: boolean,
    ): SecondaryNavigationElement[] =>
      courses.map((course) => ({
        id: course.layer_id,
        searchValue: course.name,
        type: "async-tab",
        tabComponent: (isActive) => (
          <CourseTile
            key={course.layer_id}
            course={course}
            isActive={isActive}
          />
        ),
        contentComponent: <CourseContent course={course} />,
        toolbarComponent: <CourseToolbar role={course.role} />,
        disabled,
      }));

    // Ongoing Courses
    tabs = tabs.concat(createTabsForCourses(ongoingCourses, false));

    // Not Started Courses Divider
    if (notStartedCourses.length) {
      tabs.push({
        id: "not-started-courses-divider",
        type: "divider",
        component: <SeparatorWithTitle title={"not_started_courses"} />,
      });
      tabs = tabs.concat(createTabsForCourses(notStartedCourses, true));
    }

    // Ended Courses Divider
    if (endedCourses.length) {
      tabs.push({
        id: "ended-courses-divider",
        type: "divider",
        component: <SeparatorWithTitle title={"ended_courses"} />,
      });
      tabs = tabs.concat(createTabsForCourses(endedCourses, true));
    }

    return tabs;
  })
  .build();

export { courses };
