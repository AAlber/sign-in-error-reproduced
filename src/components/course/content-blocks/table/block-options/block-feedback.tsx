import React from "react";
import { useTranslation } from "react-i18next";
import Stars from "../../feedback/stars";

type Props = { count: number; rating: number };
function GetContentBlockFeedback({ count, rating }: Props) {
  const { t } = useTranslation("page");

  if (count === 0) return null;

  return (
    <div className="flex flex-col">
      <span className="text-xs text-muted-contrast">
        {count}{" "}
        {count === 1
          ? t("course_main_content_feedback")
          : t("course_main_content_feedbacks")}
      </span>
      <Stars score={!!rating ? rating : 1} />
    </div>
  );
}

export default GetContentBlockFeedback;
