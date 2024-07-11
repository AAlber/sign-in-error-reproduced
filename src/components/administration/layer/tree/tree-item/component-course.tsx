import { Layers2Icon } from "lucide-react";
import React from "react";
import { useTranslation } from "react-i18next";
import structureHandler from "@/src/client-functions/client-administration/structure-handler";
import classNames from "@/src/client-functions/client-utils";
import { useNavigation } from "@/src/components/dashboard/navigation/zustand";
import { CourseIcon } from "@/src/components/reusable/course-layer-icons";
import Spinner from "@/src/components/spinner";
import type { Layer } from "../../../types";
import useAdministration from "../../../zustand";
import LayerOptions from "../../layer-options";
import type { TreeItemProps } from ".";
import TimeSpan from "./time-span";

const CourseComponent: React.FC<TreeItemProps> = (props) => {
  const { layer, clone } = props;
  const { course } = layer;
  const { setPage, navigateToTab: navigatorToTab } = useNavigation();

  const { rootFlatLayer } = useAdministration();

  // disable navigating into courseLayer when course properties are not yet ready
  const isDisabled = (!course || !course.icon) && !layer.isLinkedCourse;

  /**
   * LinkedCourses are also categorized as Courses (by setting the isCourse property of Layer to true)
   * but they do not contain the course object because a course can only belong to 1 layer_id
   * linkedCourses are connected to the ActualCourse by the `linkedCourseLayerId`
   */
  const layerId = layer.isLinkedCourse ? layer.linkedCourseLayerId! : layer.id;

  const numLinkedCourses = rootFlatLayer?.reduce((a, c) => {
    return c.linkedCourseLayerId
      ? a + Number(c.linkedCourseLayerId === layer?.id)
      : a;
  }, 0);

  const linkedCourse = rootFlatLayer?.find(
    (l) => l.id === layer.linkedCourseLayerId,
  );

  const pathToLinkedCourse = linkedCourse
    ? structureHandler.utils.layerTree
        .getHierarchyPath(linkedCourse.id as string, rootFlatLayer ?? [])
        .map(({ name }) => name)
        .join(" / ")
    : undefined;

  const { t } = useTranslation("page");

  return (
    <>
      <span
        className={classNames(
          "ml-1 mr-2 text-xl transition-opacity",
          isDisabled && "opacity-60",
        )}
      >
        {course && course.icon ? (
          <CourseIcon
            icon={course.icon}
            iconType={course.iconType}
            className="h-6 w-6 text-xl"
          />
        ) : layer.isLinkedCourse && linkedCourse?.course ? (
          <CourseIcon
            icon={linkedCourse.course.icon}
            iconType={linkedCourse.course.iconType}
            className="h-6 w-6 text-xl"
          />
        ) : (
          <Spinner size="w-6 h-6" />
        )}
      </span>
      <button
        disabled={isDisabled}
        onClick={() => {
          setPage("COURSES");
          navigatorToTab(layerId);
        }}
        className={classNames(
          "flex grow items-center space-x-2 text-start text-sm text-contrast",
          isDisabled && "pointer-events-none",
        )}
        aria-disabled={isDisabled}
        tabIndex={isDisabled ? -1 : undefined}
      >
        {layer.name}
        <span className="pl-1 text-muted-contrast">
          {layer.isLinkedCourse && linkedCourse && pathToLinkedCourse
            ? `- Mirror of ${pathToLinkedCourse}`
            : ""}
        </span>
        {!!numLinkedCourses && (
          <div className="ml-2 flex items-center gap-1 text-primary">
            <Layers2Icon className="h-3 w-3" />
            <span>
              {numLinkedCourses}{" "}
              {numLinkedCourses > 1
                ? t("mirrored_courses")
                : t("mirrored_course")}
            </span>
          </div>
        )}
        <TimeSpan
          layer={
            layer.isLinkedCourse && linkedCourse
              ? (linkedCourse as Layer)
              : layer
          }
        />
      </button>
      {!clone && <LayerOptions layer={layer} />}
    </>
  );
};

export default React.memo(CourseComponent);
