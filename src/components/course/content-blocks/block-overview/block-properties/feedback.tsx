import { useTranslation } from "react-i18next";
import { replaceVariablesInString } from "@/src/client-functions/client-utils";
import WithToolTip from "@/src/components/reusable/with-tooltip";
import type { ContentBlock } from "@/src/types/course.types";
import useUser from "@/src/zustand/user";
import Stars from "../../feedback/stars";

export const OverviewFeedback = ({ block }: { block: ContentBlock }) => {
  const { t } = useTranslation("page");

  const { user } = useUser();

  if (!user.institution?.institutionSettings.addon_lms_feedbacks) return null;

  return (
    <div className="ml-auto flex h-full items-center">
      <WithToolTip
        text={replaceVariablesInString(t("content_block_feedback_tooltip"), [
          block.feedback ? block.feedback.count : 0,
        ])}
      >
        <Stars score={block.feedback ? block.feedback.rating : 0} />
      </WithToolTip>
    </div>
  );
};
