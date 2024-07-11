import { useTranslation } from "react-i18next";
import { Label } from "@/src/components/reusable/shadcn-ui/label";
import { Textarea } from "@/src/components/reusable/shadcn-ui/text-area";

export const FeedbackTextarea = ({
  feedbackText,
  setFeedbackText,
}: {
  feedbackText: string;
  setFeedbackText: (value: string) => void;
}) => {
  const { t } = useTranslation("page");

  return (
    <div className="flex flex-col gap-2">
      <Label>{t("course_main_table_header_feedback")}</Label>
      <Textarea
        className="w-full ring-0 ring-offset-0 focus:border-primary"
        placeholder={t("course_main_content_feedbacks_text_placeholder")}
        value={feedbackText}
        onChange={(e) => setFeedbackText(e.target.value)}
      />
    </div>
  );
};
