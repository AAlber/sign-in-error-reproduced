import { updateCourseDescription } from "@/src/client-functions/client-course";
import classNames from "@/src/client-functions/client-utils";
import type { Course } from "@prisma/client";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { silentlyRefreshDynamicTabs } from "../../dashboard/functions";
import { FormattedTextArea } from "../../reusable/formatted-textarea";
import { useCreateFormattedTextarea } from "../../reusable/formatted-textarea/hooks";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../reusable/shadcn-ui/accordion";
import useCourse from "../zustand";
import UpcomingEvents from "./upcoming-event";

function CourseInfo() {
  const [description, setDescription] = useState<string | null>(null);

  const { course, updateCourse, hasSpecialRole } = useCourse();
  const { t } = useTranslation("page");

  const formattedTextareaEditor = useCreateFormattedTextarea({
    editable: hasSpecialRole,
    defaultContent: course.description || "",
    features: {
      slashCommand: {
        omitSlashMenuCommand: [
          "code-block",
          "youtube",
          "image",
          "file",
          "table",
          "table-of-content",
          "columns",
        ],
      },
    },
    onBlur: async () => await handleSaveOnBlur(),
    onUpdate: ({ editor }) => setDescription(editor.getHTML()),
  });

  const handleSaveOnBlur = async () => {
    if (!description) return;

    const response = await updateCourseDescription(course.id, description);

    if (!response.ok) return;

    const json = (await response.json()) as Course;
    updateCourse({ ...course, description: json.description });
    silentlyRefreshDynamicTabs();
    setDescription(null);
  };

  return (
    <header className={classNames("-mt-2 flex h-full flex-col pb-2")}>
      <div className="flex w-full flex-1 flex-col">
        <Accordion type="single" collapsible defaultValue="schedule">
          <AccordionItem value="description">
            <AccordionTrigger className="px-4 text-contrast/80">
              {t("description")}
            </AccordionTrigger>
            <AccordionContent className="h-full px-4 text-muted-contrast">
              <FormattedTextArea
                editor={formattedTextareaEditor}
                className="relative h-full overflow-y-scroll"
              />
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="schedule" className="border-b-0">
            <AccordionTrigger className="relative px-4 text-contrast/80">
              {" "}
              {t("schedule")}
              <div className="absolute -bottom-5 z-10 h-5 w-full bg-gradient-to-b from-background to-transparent"></div>
            </AccordionTrigger>
            <AccordionContent className="relative h-full overflow-y-scroll">
              <UpcomingEvents />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </header>
  );
}

export default CourseInfo;
