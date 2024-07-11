import { useTranslation } from "react-i18next";
import contentBlockHandler from "@/src/client-functions/client-contentblock/handler";
import { toast } from "@/src/components/reusable/toaster/toast";
import type { ContentBlock } from "@/src/types/course.types";
import useCourse from "../../../zustand";
import BlockDate from "./block-date-component";

type Props = {
  block: ContentBlock;
};

export default function StartDate({
  block: { id: blockId, dueDate, startDate },
}: Props) {
  const { t } = useTranslation("page");
  const { hasSpecialRole } = useCourse();

  const handleDateChange = (date: Date) => {
    if (!date) return;
    if (dueDate && new Date(dueDate).getTime() < date.getTime()) {
      return toast.warning("start_date_cannot_be_before", {
        description: "start_date_cannot_be_before_desc",
      });
    }

    contentBlockHandler.update.block({ id: blockId, startDate: date });
  };

  const handleRemoveButtonClick = async () => {
    if (!hasSpecialRole) return;
    contentBlockHandler.update.block({
      id: blockId,
      startDate: null,
    });
  };

  if (!hasSpecialRole && !startDate) return null;
  return (
    <BlockDate
      date={startDate}
      addDateTitle={t("course_main_content_block_add_start_date")}
      onDateChange={handleDateChange}
      onRemoveButtonClick={handleRemoveButtonClick}
    />
  );
}
