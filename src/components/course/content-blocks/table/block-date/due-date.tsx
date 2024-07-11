import { useTranslation } from "react-i18next";
import contentBlockHandler from "@/src/client-functions/client-contentblock/handler";
import { toast } from "@/src/components/reusable/toaster/toast";
import type { ContentBlock } from "@/src/types/course.types";
import useCourse from "../../../zustand";
import BlockDate from "./block-date-component";

type Props = {
  block: ContentBlock;
};

export default function DueDate({
  block: { id: blockId, dueDate, startDate },
}: Props) {
  const { t } = useTranslation("page");
  const { hasSpecialRole } = useCourse();

  const handleDateChange = (date: Date) => {
    if (!date) return;
    if (startDate && new Date(startDate).getTime() > date.getTime()) {
      return toast.warning("due_date_cannot_be_before", {
        description: "due_date_cannot_be_before_desc",
      });
    }

    contentBlockHandler.update.block({ id: blockId, dueDate: date });
  };

  const handleRemoveButtonClick = () => {
    if (!hasSpecialRole) return;
    contentBlockHandler.update.block({
      id: blockId,
      dueDate: null,
    });
  };

  if (!hasSpecialRole && !dueDate) return null;
  return (
    <BlockDate
      date={dueDate}
      addDateTitle={t("course_main_content_block_add_due_date")}
      onDateChange={handleDateChange}
      onRemoveButtonClick={handleRemoveButtonClick}
    />
  );
}
