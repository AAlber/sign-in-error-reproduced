import { track } from "@vercel/analytics";
import { updateCourseTheme } from "@/src/client-functions/client-course";
import { silentlyRefreshDynamicTabs } from "../../dashboard/functions";
import { useStreamChatContext } from "../../getstream";
import { CourseIcon } from "../../reusable/course-layer-icons";
import { IconSelector } from "../../reusable/icon-selector";
import useCourse from "../zustand";
import { Button } from "../../reusable/shadcn-ui/button";

export function EmojiIcon() {
  const { hasSpecialRole, course } = useCourse();
  const ctx = useStreamChatContext();
  const updateCourse = useCourse((state) => state.updateCourse);

  return (
    <div className={`${!hasSpecialRole && "pointer-events-none"}`}>
      <IconSelector
        disabled={!hasSpecialRole}
        onSelect={async (icon, type) => {
          if (!course) return;
          track("Changed course icon", { type });
          const finalType = type === "custom" ? "image" : type;
          updateCourse({ ...course, icon, iconType: finalType });

          const { layer_id } = course;
          const channel = ctx.client?.channel("course", layer_id);

          channel
            ?.updatePartial({
              set: { image: icon } as any,
            })
            .catch(console.log);

          await updateCourseTheme({
            course: {
              id: course.id,
              icon: icon,
              iconType: finalType,
              color: course.color,
              bannerImage: course.bannerImage,
            },
          });
          silentlyRefreshDynamicTabs();
        }}
      >
        <Button
          disabled={!hasSpecialRole}
          variant={"ghost"}
          className="size-28"
        >
          <CourseIcon
            icon={course.icon}
            iconType={course.iconType}
            className="size-28 text-[6.5rem]"
            height={300}
            width={300}
          />
        </Button>
      </IconSelector>
    </div>
  );
}
