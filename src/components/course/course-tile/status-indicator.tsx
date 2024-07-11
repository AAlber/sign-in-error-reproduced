import { AlertTriangleIcon, Check } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { CourseWithDurationAndProgress } from "@/src/types/user.types";
import CircularProgress from "../../reusable/circular-progress";
import WithToolTip from "../../reusable/with-tooltip";

type Props = {
  course: CourseWithDurationAndProgress;
};

export default function StatusIndicator({ course }: Props) {
  const { t } = useTranslation("page");

  const renderStatus = () => {
    switch (course.userProgress?.status) {
      case "PASSED":
        return (
          <WithToolTip
            text={t("course.status_indicator.passed")}
            className="flex size-4 items-center justify-center rounded-full border border-positive bg-positive/50 text-xs text-contrast"
          >
            <Check size={10} />
          </WithToolTip>
        );
      case "FAILED":
        return (
          <WithToolTip
            text="course.status_indicator.failed"
            className="flex size-4 items-center justify-center rounded-full border border-destructive bg-destructive/50 text-xs text-contrast"
          >
            <div className="text-xs">!</div>
          </WithToolTip>
        );
      case "ON_TRACK":
        return (
          <WithToolTip
            text="course.status_indicator.on_track"
            className="flex size-4 items-center justify-center rounded-full border border-positive bg-positive/50 text-xs text-contrast"
          >
            <Check size={10} />
          </WithToolTip>
        );
      case "RISK_OF_FAILURE":
        return (
          <WithToolTip
            text="course.status_indicator.risk_of_failure"
            className="flex size-4 items-center justify-center rounded-full border border-warning bg-warning/50 text-xs text-contrast"
          >
            <AlertTriangleIcon size={10} />
          </WithToolTip>
        );
      case "IN_PROGRESS":
        return !!course.publishedContentBlockCount ? (
          <div className="flex items-center gap-2 text-xs text-muted-contrast">
            <CircularProgress
              progress={
                (course.userProgress.finishedContentBlocks ||
                  0 / course.publishedContentBlockCount) * 100
              }
              className="size-4 text-transparent"
              textClassName="text-[0rem]"
              strokeWidth={15}
              finishedComponent={<Check size={12} className="text-primary" />}
              animateFrom={0}
            />
            {course.userProgress.finishedContentBlocks || 0}/
            {course.publishedContentBlockCount}
          </div>
        ) : null;
    }
  };

  if (course.role !== "member" || !course.userProgress) return null;
  return (
    <div className="flex items-center gap-2 text-xs text-muted-contrast">
      {renderStatus()}
    </div>
  );
}
