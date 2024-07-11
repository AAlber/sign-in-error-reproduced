import { CaretSortIcon } from "@radix-ui/react-icons";
import dayjs from "dayjs";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { DatePicker } from "@/src/components/reusable/date-time-picker/date-picker";
import Form from "@/src/components/reusable/formlayout";
import { toast } from "@/src/components/reusable/toaster/toast";
import useContentBlockModal from "./zustand";

export const FormTimeOptions = () => {
  const { t } = useTranslation("page");
  const { startDate, setStartDate, dueDate, setDueDate, isOpen } =
    useContentBlockModal();

  useEffect(() => {
    if (!isOpen) {
      setStartDate(null);
      setDueDate(null);
    }
  }, [isOpen]);

  return (
    <Form>
      <Form.SettingsSection>
        <Form.SettingsItem>
          <Form.Item
            label="content_block.time_options.start_date"
            description="content_block.time_options.start_date_description"
          >
            <DatePicker
              date={startDate ?? new Date()}
              onChange={(date) => {
                if (!date) return;
                if (dueDate && dueDate < date) {
                  return toast.warning(
                    "course_main_content_block_add_start_date_greater_than_due_date_warning.title",
                    {
                      description:
                        "course_main_content_block_add_start_date_greater_than_due_date_warning.description.",
                    },
                  );
                } else {
                  setStartDate(date);
                }
              }}
            >
              <div className="col-span-2 flex items-center justify-end">
                <div className="-mr-2 flex h-6 items-center justify-end rounded-md border-0 border-input bg-transparent p-2 pr-0.5 text-sm text-contrast ring-offset-background placeholder:text-muted hover:bg-accent/50 focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50">
                  {startDate
                    ? dayjs(startDate).format("DD. MMM YYYY")
                    : t("content_block.time_options.no_start_date")}
                  <CaretSortIcon className="ml-1 h-5 w-5 opacity-50" />
                </div>
              </div>
            </DatePicker>
          </Form.Item>
        </Form.SettingsItem>
        <Form.SettingsItem>
          <Form.Item
            label="content_block.time_options.due_date"
            description="content_block.time_options.due_date_description"
          >
            <DatePicker
              date={dueDate ?? new Date()}
              onChange={(date) => {
                if (!date) return;
                if (startDate && startDate > date) {
                  return toast.warning(
                    "course_main_content_block_add_due_date_less_than_start_date_warning.title",
                    {
                      description:
                        "course_main_content_block_add_due_date_less_than_start_date_warning.description",
                    },
                  );
                } else {
                  console.log(date);
                  setDueDate(date);
                }
              }}
            >
              <div className="col-span-2 flex items-center justify-end">
                <div className="-mr-2 flex h-6 items-center justify-end rounded-md border-0 border-input bg-transparent p-2 pr-0.5 text-sm text-contrast ring-offset-background placeholder:text-muted hover:bg-accent/50 focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50">
                  {dueDate
                    ? dayjs(dueDate).format("DD. MMM YYYY")
                    : t("content_block.time_options.no_due_date")}
                  <CaretSortIcon className="ml-1 h-5 w-5 opacity-50" />
                </div>
              </div>
            </DatePicker>
          </Form.Item>
        </Form.SettingsItem>
      </Form.SettingsSection>
    </Form>
  );
};
