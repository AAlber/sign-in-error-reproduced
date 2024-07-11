import { HoverCard, HoverCardTrigger } from "@radix-ui/react-hover-card";
import React from "react";
import { useTranslation } from "react-i18next";
import { toastNoSubscription } from "@/src/client-functions/client-stripe/alerts";
import { hasActiveSubscription } from "@/src/client-functions/client-stripe/data-extrapolation";
import useImportCourseDataModal from "@/src/components/popups/import-course-data-modal/zustand";
import { Button } from "@/src/components/reusable/shadcn-ui/button";
import { HoverCardSheet } from "@/src/components/reusable/shadcn-ui/hover-card";
import Tip from "@/src/components/reusable/tips/tip";
import CourseNewDropdown from "../../info/course-new-button";
import LearnCourse from "../table/toolbar/learn-menu";

type Props = {
  layerId: string;
};

export default function NoCourseActions({ layerId }: Props) {
  const { t } = useTranslation("page");
  const { init } = useImportCourseDataModal();

  return (
    <div className="mt-4 flex items-center gap-2">
      <CourseNewDropdown>
        <Button>{t("general.create")}</Button>
      </CourseNewDropdown>
      <HoverCard openDelay={250}>
        <HoverCardTrigger>
          <Button
            onClick={() => {
              if (!hasActiveSubscription()) return toastNoSubscription();
              init(layerId);
            }}
          >
            {t("import")}
          </Button>
        </HoverCardTrigger>
        <HoverCardSheet side="bottom" className="ml-20 p-2">
          <Tip description="importing_existing_course_layers_description" />
        </HoverCardSheet>
      </HoverCard>
      <LearnCourse />
    </div>
  );
}
