import dayjs from "dayjs";
import { ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import classNames, { truncate } from "@/src/client-functions/client-utils";
import { CourseIcon } from "@/src/components/reusable/course-layer-icons";
import StructurePath from "@/src/components/reusable/layer-path";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/src/components/reusable/shadcn-ui/context-menu";
import { DropdownMenuSeparator } from "@/src/components/reusable/shadcn-ui/dropdown-menu";
import type { CourseWithDurationAndProgress } from "@/src/types/user.types";
import DeleteCourse from "./delete-course";
import ShowInStructure from "./show-in-structure";
import StatusIndicator from "./status-indicator";
import CourseTileBox from "./tile-box";

export default function CourseTile({
  course,
  isActive,
}: {
  isActive: boolean;
  course: CourseWithDurationAndProgress;
}) {
  const { t } = useTranslation("page");
  const courseHasEnded =
    course.end !== null &&
    new Date(course.end).getTime() < new Date().getTime();

  const courseHasStarted =
    course.start === null ||
    new Date(course.start).getTime() < new Date().getTime();

  const hasNotStartedOrEnded = !courseHasStarted || courseHasEnded;

  return (
    <ContextMenu>
      <ContextMenuTrigger
        className="relative"
        disabled={course.role === "member" || course.role === "educator"}
      >
        {/* <IssueNotification course={course} /> */}
        <CourseTileBox
          key={course.layer_id}
          className={classNames(
            isActive
              ? "border-muted-contrast bg-accent"
              : "border-border bg-foreground",
            hasNotStartedOrEnded
              ? "pointer-events-none cursor-not-allowed"
              : "group cursor-pointer hover:bg-accent",
            "p-4",
          )}
        >
          {isActive && (
            <ChevronRight className="absolute right-3 top-4 h-5 w-5 text-muted-contrast" />
          )}
          <h2 className="text-sm font-medium text-contrast">
            {truncate(course.name, 50)}
          </h2>

          {hasNotStartedOrEnded ? (
            <CourseIcon
              icon={course?.icon}
              iconType={course?.iconType}
              className="absolute -bottom-6 right-0 z-10 h-20 w-20 text-6xl opacity-50"
            />
          ) : (
            <CourseIcon
              icon={course?.icon}
              iconType={course?.iconType}
              className="absolute -bottom-6 right-0 z-10 h-20 w-20 text-6xl transition-all duration-300 ease-in-out group-hover:-bottom-6 group-hover:-right-6"
            />
          )}
          <CourseIcon
            icon={course?.icon}
            iconType={course?.iconType}
            className="absolute -bottom-6 right-0 h-20 w-20 text-6xl blur-3xl"
          />
          <div className="absolute bottom-4 left-4 z-10">
            {!hasNotStartedOrEnded && <StatusIndicator course={course} />}
            {hasNotStartedOrEnded && (
              <span className="text-xs text-muted-contrast">
                {!courseHasStarted &&
                  t("starts_on", {
                    start: dayjs(course.start).format("DD. MMM YYYY"),
                  })}
                {courseHasEnded &&
                  t("ended_on", {
                    end: dayjs(course.end).format("DD. MMM YYYY"),
                  })}
              </span>
            )}
          </div>
        </CourseTileBox>
      </ContextMenuTrigger>
      <ContextMenuContent className="w-[250px]">
        <ContextMenuGroup onClick={(e) => e.stopPropagation()}>
          <ContextMenuLabel>
            {t("structurepath")}
            <p className="text-xs font-normal text-muted-contrast">
              <StructurePath layerId={course.layer_id} />
            </p>
          </ContextMenuLabel>

          {course.role === "moderator" && (
            <ContextMenuSeparator className="bg-border" />
          )}
          {course.role === "moderator" && (
            <ShowInStructure layerId={course.layer_id} />
          )}

          <DropdownMenuSeparator className="bg-border" />
          {course.role === "moderator" && (
            <DeleteCourse layerId={course.layer_id} />
          )}
        </ContextMenuGroup>
      </ContextMenuContent>
    </ContextMenu>
  );
}
