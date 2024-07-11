import { updateCourseTheme } from "@/src/client-functions/client-course";
import { silentlyRefreshDynamicTabs } from "@/src/components/dashboard/functions";
import { courseGradients } from "@/src/utils/theming";
import useCourse from "../../zustand";

export default function GradientSelection() {
  const { course, updateCourse } = useCourse();

  if (!course) return null;
  return (
    <div className="grid w-full grid-cols-3 gap-3 gap-y-2">
      {courseGradients.map((c, idx) => (
        <button
          key={idx}
          onClick={async () => {
            updateCourse({ ...course, color: idx, bannerImage: null });
            await updateCourseTheme({
              course: {
                id: course.id,
                icon: course.icon,
                iconType: course.iconType,
                color: idx,
                bannerImage: null,
              },
            });
            silentlyRefreshDynamicTabs();
          }}
          className={`${
            c.gradient
          } h-14 w-28 overflow-hidden rounded-md border border-border bg-gradient-to-tr ring-background transition-all duration-200 ease-in-out hover:scale-110 ${
            course.color === idx &&
            "ring-1 ring-contrast ring-offset-background"
          }`}
        ></button>
      ))}
    </div>
  );
}
