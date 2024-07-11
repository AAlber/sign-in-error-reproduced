import React, { useCallback } from "react";
import type { CourseWithDurationAndProgress } from "@/src/types/user.types";
import useFileDrop from "../reusable/file-uploaders/zustand";
import CourseContentDisplay from "./content-blocks";
import useContentBlockModal from "./content-blocks/content-block-creator/zustand";
import CourseManagement from "./course-management";
import { useCourseTab } from "./courses-tab.zustand";
import useCourseSetup from "./hooks/setup";
import CoursePeerFeedbackTable from "./peer-feedback";
import useCourse, { CoursePage } from "./zustand";

type Props = {
  course: CourseWithDurationAndProgress;
};

export default function CourseContent({ course: courseFromTabs }: Props) {
  const course = useCourseTab((state) =>
    state.getCourse(courseFromTabs.layer_id),
  );

  useCourseSetup(course);
  const page = useCourse((state) => state.page);
  const openModal = useContentBlockModal((state) => state.openModal);

  const handleOnDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      openModal("File");
      const files: File[] = Array.from(e.dataTransfer.files);
      const { uppy } = useFileDrop.getState();
      if (!uppy) return;
      files.forEach((file) => {
        uppy.addFile({
          name: file.name,
          type: file.type,
          data: file,
        });
      });
    },
    [openModal],
  );

  const handleOnDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  if (!course) return null;
  return (
    <div
      onDrop={handleOnDrop}
      onDragOver={handleOnDragOver}
      className="relative flex size-full grow select-none flex-col items-center gap-4 overflow-hidden overflow-y-scroll"
    >
      {renderCourseComponent(page, course)}
    </div>
  );
}

function renderCourseComponent(
  page: CoursePage,
  course: CourseWithDurationAndProgress,
) {
  switch (page) {
    case CoursePage.USERS:
      return <CourseManagement />;
    case CoursePage.SETTINGS:
      return <CourseManagement />;
    case CoursePage.PEER_FEEDBACK:
      return <CoursePeerFeedbackTable />;
    case CoursePage.ORGANIZER:
      return <CourseContentDisplay course={course} />;
    case CoursePage.LEARNING_JOURNEY:
      return <CourseContentDisplay course={course} />;
    default:
      null;
  }
}
