import dayjs from "dayjs";
import { Plus, X } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import contentBlockHandler from "@/src/client-functions/client-contentblock/handler";
import classNames from "@/src/client-functions/client-utils";
import { DatePicker } from "@/src/components/reusable/date-time-picker/date-picker";
import { toast } from "@/src/components/reusable/toaster/toast";
import type { ContentBlock } from "@/src/types/course.types";
import useUser from "@/src/zustand/user";
import useCourse from "../../../zustand";
import PropertyBox from "./property-box";

export default function PropertyDueDate({ block }: { block: ContentBlock }) {
  const { user } = useUser();
  dayjs.locale(user.language);
  const { t } = useTranslation("page");
  const { hasSpecialRole } = useCourse();

  const [dueDate, setDueDate] = useState(block.dueDate);

  if (!hasSpecialRole && !block.dueDate) return null;

  return (
    <div className={classNames(!hasSpecialRole && "pointer-events-none")}>
      <DatePicker
        date={dueDate ?? new Date()}
        showTime={false}
        onChange={(date) => {
          if (!date) return;
          if (
            block.startDate &&
            new Date(block.startDate).getDate() > date.getDate()
          )
            return toast.warning(
              "course_main_content_block_add_due_date_less_than_start_date_warning.title",
              {
                description:
                  "course_main_content_block_add_due_date_less_than_start_date_warning.description",
              },
            );
          setDueDate(date);
          contentBlockHandler.update.block({ id: block.id, dueDate: date });
        }}
      >
        <PropertyBox interactable>
          {dueDate ? (
            <span className="flex items-center gap-1">
              {hasSpecialRole && (
                <button
                  className="hover:text-destructive"
                  onClick={() => {
                    setDueDate(null);
                    contentBlockHandler.update.block({
                      id: block.id,
                      dueDate: null,
                    });
                  }}
                >
                  <X size={16} />
                </button>
              )}{" "}
              Due to {dayjs(dueDate).format("DD. MMM YYYY")}
            </span>
          ) : (
            <span className="flex items-center gap-1 text-muted-contrast">
              <Plus size={16} /> {t("course_main_content_block_add_due_date")}
            </span>
          )}
        </PropertyBox>
      </DatePicker>
    </div>
  );
}
