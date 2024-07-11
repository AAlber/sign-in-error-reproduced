import dayjs from "dayjs";
import { Plus, X } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import contentBlockHandler from "@/src/client-functions/client-contentblock/handler";
import { DatePicker } from "@/src/components/reusable/date-time-picker/date-picker";
import { toast } from "@/src/components/reusable/toaster/toast";
import type { ContentBlock } from "@/src/types/course.types";
import useUser from "@/src/zustand/user";
import useCourse from "../../../zustand";
import PropertyBox from "./property-box";

export default function PropertStartDate({ block }: { block: ContentBlock }) {
  const { user } = useUser();
  dayjs.locale(user.language);
  const { t } = useTranslation("page");

  const { hasSpecialRole } = useCourse();

  const [startDate, setStartDate] = useState(block.startDate);

  if (!hasSpecialRole && !block.startDate) return null;

  return (
    <DatePicker
      date={startDate ?? new Date()}
      showTime={false}
      onChange={(date) => {
        if (!date) return;
        if (block.dueDate && new Date(block.dueDate).getDate() < date.getDate())
          return toast.warning(
            "course_main_content_block_add_start_date_greater_than_due_date_warning.title",
            {
              description:
                "course_main_content_block_add_start_date_greater_than_due_date_warning.description.",
            },
          );
        setStartDate(date);
        contentBlockHandler.update.block({
          id: block.id,
          startDate: date,
        });
      }}
    >
      <PropertyBox interactable>
        {startDate ? (
          <span className="flex items-center gap-1">
            {hasSpecialRole && (
              <button
                className="hover:text-destructive"
                onClick={() => {
                  contentBlockHandler.update.block({
                    id: block.id,
                    startDate: null,
                  });
                  setStartDate(null);
                }}
              >
                <X size={16} />
              </button>
            )}
            Starts on {dayjs(startDate).format("DD. MMM YYYY")}
          </span>
        ) : (
          <span className="flex items-center gap-1 text-muted-contrast">
            <Plus size={16} /> {t("course_main_content_block_add_start_date")}
          </span>
        )}
      </PropertyBox>
    </DatePicker>
  );
}
