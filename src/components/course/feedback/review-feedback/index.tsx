import { useQuery } from "@tanstack/react-query";
import { MessageCircle } from "lucide-react";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { getFeedback } from "@/src/client-functions/client-course";
import { Button } from "@/src/components/reusable/shadcn-ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/src/components/reusable/shadcn-ui/popover";
import WithToolTip from "@/src/components/reusable/with-tooltip";
import Skeleton from "@/src/components/skeleton";
import useCourse from "../../zustand";
import FeedbacksContainer from "./feedbacks-container";
import SearchUser from "./search-user";

const CourseUserFeedbacks = () => {
  const { course } = useCourse();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { t } = useTranslation("page");

  const queryKey = [`course-${course?.layer_id}-feedback`, searchQuery];
  const { data, isLoading } = useQuery({
    queryFn: () => handleGetFeedbacks(),
    enabled: isOpen,
    queryKey,
    staleTime: 60000,
  });

  const handleGetFeedbacks = async () => {
    const feedbacks = await getFeedback(course?.layer_id ?? "", searchQuery);
    return feedbacks;
  };

  const renderView = () => {
    const feedbacks = Array.isArray(data) && !!data.length;
    const emptyFeedbacks = Array.isArray(data) && !!!data.length;

    if (isLoading) {
      return <Skeleton />;
    } else if (emptyFeedbacks) {
      return (
        <div className="flex min-h-[40px] min-w-[240px] items-center justify-center text-sm text-muted-contrast">
          <span>{t("course_header_review_feedback_empty_feedbacks")}</span>
        </div>
      );
    } else if (feedbacks) {
      return <FeedbacksContainer feedbacks={data} />;
    } else return null;
  };

  return (
    <Popover
      open={isOpen}
      onOpenChange={() => {
        setIsOpen(!isOpen);
        setSearchQuery("");
      }}
    >
      <PopoverTrigger>
        <WithToolTip text="course_header_review_feedback">
          <Button
            size={"icon"}
            variant={"ghost"}
            onClick={() => {
              setIsOpen(!isOpen);
            }}
          >
            <MessageCircle className="h-4 w-4" />
          </Button>
        </WithToolTip>
      </PopoverTrigger>
      <PopoverContent
        className="mr-9 mt-2.5 min-w-[400px] rounded-md p-2 focus:outline-none"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-2 rounded-sm border border-border p-1">
          <SearchUser setSearchQuery={setSearchQuery} />
        </div>
        <div className="rounded-sm border border-border p-1">
          {renderView()}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default CourseUserFeedbacks;
