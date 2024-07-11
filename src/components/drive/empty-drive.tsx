import { FileX } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useDriveType } from "@/src/client-functions/client-cloudflare/hooks";
import { replaceVariablesInString } from "@/src/client-functions/client-utils";
import { isUserOnMac } from "@/src/utils/utils";
import useCourse from "../course/zustand";
import { EmptyState } from "../reusable/empty-state";

export default function EmptyDrive() {
  const { hasSpecialRole } = useCourse();
  const driveType = useDriveType();
  const isOnMac = isUserOnMac();
  const { t } = useTranslation("page");
  const cmdButton = isOnMac ? "Cmd" : "Ctrl";

  return (
    <EmptyState
      icon={FileX}
      size="normal"
      title={"drive-empty-title"}
      description={
        !hasSpecialRole && driveType === "course-drive"
          ? "drive-empty-course-member-description"
          : replaceVariablesInString(t("drive-empty-description"), [
              cmdButton,
              cmdButton,
            ])
      }
    >
      {hasSpecialRole && (
        <EmptyState.LearnTrigger
          triggerId="course-learn-menu"
          focusVideo="learn_menu.course.drive.video_url"
        />
      )}
    </EmptyState>
  );
}
