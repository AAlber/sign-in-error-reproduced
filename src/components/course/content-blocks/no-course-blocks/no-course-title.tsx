import React from "react";
import { useTranslation } from "react-i18next";
import { truncate } from "@/src/client-functions/client-utils";

type Props = {
  courseName: string;
  hasSpecialRole: boolean;
};

export default function NoCourseTitle({ courseName, hasSpecialRole }: Props) {
  const { t } = useTranslation("page");
  return (
    <div>
      <p className="mt-1 text-xl font-bold tracking-tight text-contrast sm:text-3xl">
        {t("course_main_no_content_title")} {truncate(courseName ?? "", 40)}
      </p>

      <p className="mt-1 tracking-tight text-muted-contrast">
        {t("course_main_no_content_description")}
        <br />
        {hasSpecialRole ? (
          <>{t("course_main_no_content_extra_description_moderator")}</>
        ) : (
          <>{t("course_main_no_content_extra_description_student")}</>
        )}
      </p>
    </div>
  );
}
