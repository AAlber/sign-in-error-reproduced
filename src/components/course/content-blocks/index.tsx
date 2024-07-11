import { useEffect, useState } from "react";
import {
  hasContentBlocks,
  hasPublishedContentBlocks,
  hasTotalContentBlocks,
} from "@/src/client-functions/client-contentblock/utils";
import { courseDrive } from "@/src/client-functions/client-drive/drive-builder";
import api from "@/src/pages/api/api";
import type { ContentBlock } from "@/src/types/course.types";
import type { CourseWithDurationAndProgress } from "@/src/types/user.types";
import useUser from "@/src/zustand/user";
import CreateFeedback from "../feedback/create-feedback";
import { LearningJourney } from "../learning-journey";
import useCourse, { CoursePage } from "../zustand";
import ContentBlockFinishedModal from "./block-finished-modal";
import NoCourseContent from "./no-course-blocks";
import DndTable from "./table/dnd-table";

type Props = {
  course: CourseWithDurationAndProgress;
};

export default function CourseContentDisplay({ course }: Props) {
  const page = useCourse((state) => state.page);
  const refresh = useCourse((state) => state.refresh);
  const contentBlocks = useCourse((state) => state.contentBlocks);
  const setContentBlocks = useCourse((state) => state.setContentBlocks);
  const updateCourse = useCourse((state) => state.updateCourse);
  const hasSpecialRole = useCourse((state) => state.hasSpecialRole);
  const isTestingMode = useCourse((state) => state.isTestingMode);

  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(true);

  const isCourseFeedbackEnabled =
    user.institution?.institutionSettings.addon_lms_feedbacks &&
    user.institution?.institutionSettings.feedback_course;

  useEffect(() => {
    if (!course.layer_id) return;

    setContentBlocks([]); // reset state
    if (!isLoading) setIsLoading(true);

    const url = new URL(api.getContentCourseBlocks, window.location.origin);
    url.searchParams.append("layerId", course.layer_id);

    fetch(url).then(async (res) => {
      const data = (await res.json()) as { contentBlocks: ContentBlock[] };
      const cb = data.contentBlocks || [];

      if (Array.isArray(cb))
        cb.sort((a, b) => Number(a.position) - Number(b.position));

      if (cb.length !== course.totalContentBlockCount && cb.length > 0) {
        updateCourse({
          ...course,
          totalContentBlockCount: cb.length,
        });
      }

      setContentBlocks(cb);
      setIsLoading(false);
    });

    courseDrive.api.listFilesInDrive({
      type: "course-drive",
      layerId: course.layer_id,
    });
  }, [course.layer_id, refresh]);

  const isStudent = !(hasSpecialRole || isTestingMode);

  const showContent = () => {
    if (isStudent) {
      return hasPublishedContentBlocks(course);
    }
    return hasTotalContentBlocks(course) || hasContentBlocks(contentBlocks);
  };

  return (
    <div className="flex size-full items-start gap-4 overflow-hidden">
      <ContentBlockFinishedModal />
      {course.role === "member" && isCourseFeedbackEnabled && (
        <div className="absolute bottom-2 left-2 z-50">
          <CreateFeedback />
        </div>
      )}
      <div
        id="scroll-section"
        className="flex size-full flex-col overflow-y-scroll"
      >
        <div className="flex w-full flex-1 justify-center">
          {showContent() ? (
            <>
              {page === CoursePage.ORGANIZER && (
                <div className="relative size-full bg-foreground pt-6">
                  <DndTable loading={isLoading} />
                </div>
              )}
              {page === CoursePage.LEARNING_JOURNEY && <LearningJourney />}
            </>
          ) : (
            <NoCourseContent />
          )}
        </div>
      </div>
    </div>
  );
}
