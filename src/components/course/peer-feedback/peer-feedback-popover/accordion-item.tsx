// FeedbackAccordionItem.js
import dayjs from "dayjs";
import { truncate } from "@/src/client-functions/client-utils";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../../reusable/shadcn-ui/accordion";
import UserDefaultImage from "../../../user-default-image";
import Stars from "../../content-blocks/feedback/stars";

const FeedbackAccordionItem = ({ feedback, t }) => {
  if (!feedback.reviewer) return null;

  return (
    <AccordionItem value={feedback.id}>
      <AccordionTrigger className="p-2 text-start hover:bg-accent/30 hover:no-underline">
        <div className="flex w-full items-center justify-between pr-2">
          <div className="flex items-center gap-2">
            <UserDefaultImage user={feedback.reviewer} dimensions="h-6 w-6" />
            <div className="flex flex-col">
              <span className="text-sm text-contrast">
                {truncate(feedback.reviewer?.name, 30)}
              </span>
              <span className="text-xs text-muted-contrast">
                {truncate(feedback.reviewer?.email, 30)}
              </span>
            </div>
          </div>
          <Stars score={feedback.rating} />
        </div>
      </AccordionTrigger>
      <AccordionContent>
        <div className="p-2">
          <div className="mb-1 text-muted-contrast">
            <p>
              {t("course_header_review_feedback_updated_at")}{" "}
              <span className="ml-1">
                {dayjs(feedback.updatedAt).format("DD. MMM dddd")}
              </span>
            </p>
          </div>
          <p className="text-sm text-contrast">{feedback.text}</p>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};

export default FeedbackAccordionItem;
