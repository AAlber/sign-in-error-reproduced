import { HoverCard, HoverCardTrigger } from "@radix-ui/react-hover-card";
import { Blocks, Plus } from "lucide-react";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { toastNoSubscription } from "@/src/client-functions/client-stripe/alerts";
import { hasActiveSubscription } from "@/src/client-functions/client-stripe/data-extrapolation";
import classNames from "@/src/client-functions/client-utils";
import useCourse from "@/src/components/course/zustand";
import useImportCourseDataModal from "@/src/components/popups/import-course-data-modal/zustand";
import { EmptyState } from "@/src/components/reusable/empty-state";
import { Button } from "@/src/components/reusable/shadcn-ui/button";
import { HoverCardSheet } from "@/src/components/reusable/shadcn-ui/hover-card";
import Tip from "@/src/components/reusable/tips/tip";
import CourseNewDropdown from "../../info/course-new-button";

export default function NoCourseContent() {
  const { course, hasSpecialRole } = useCourse();
  const { t } = useTranslation("page");
  const { init } = useImportCourseDataModal();
  const [isDragOver, setIsDragOver] = useState(false);
  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);
  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);
  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      className="h-full w-full p-6 "
    >
      <EmptyState
        title="course.empty.content"
        description="course.empty.content.description"
        icon={Blocks}
        size="large"
        withBlurEffect
        className={classNames(
          isDragOver ? "border-primary" : "border-muted-contrast/50",
          "rounded-lg border border-dashed",
        )}
      >
        {hasSpecialRole && (
          <>
            <div className="flex items-center gap-2 py-4">
              <HoverCard openDelay={250}>
                <HoverCardTrigger>
                  <Button
                    onClick={() => {
                      if (!hasActiveSubscription())
                        return toastNoSubscription();
                      init(course.layer_id);
                    }}
                  >
                    {t("import")}
                  </Button>
                </HoverCardTrigger>
                <HoverCardSheet side="bottom" className="ml-20 p-2">
                  <Tip description="importing_existing_course_layers_description" />
                </HoverCardSheet>
              </HoverCard>
              <CourseNewDropdown onlyBlocks>
                <Button variant={"cta"}>
                  <Plus className="mr-1 h-4 w-4" />
                  {t("general.create")}
                </Button>
              </CourseNewDropdown>
            </div>
            <EmptyState.LearnTrigger triggerId="course-learn-menu" />
          </>
        )}
      </EmptyState>
    </div>
  );
}
