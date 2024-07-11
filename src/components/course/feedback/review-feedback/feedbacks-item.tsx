import dayjs from "dayjs";
import { ExternalLink } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/src/components/reusable/shadcn-ui/accordion";
import UserDefaultImage from "@/src/components/user-default-image";
import useUser from "@/src/zustand/user";
import { emojis } from "../emoji-score";
import type { FeedbackProps } from "./feedbacks-container";

const FeedbackItem: React.FC<FeedbackProps> = (props) => {
  const { user } = useUser();
  dayjs.locale(user.language);
  const { feedbacks } = props;
  const { t } = useTranslation("page");

  /**
   * Make sure feedback prop is an object
   */
  if (Array.isArray(feedbacks)) return null;
  if (!feedbacks.user) return null;

  const { id: userId, name: username, email, image } = feedbacks.user;
  const emoji_ = emojis.find((em) => em.score === feedbacks.score);

  /**
   * Currently moderator can only REVIEW feedbacks
   * not create feedbacks
   */
  if (user.id === userId) return null;
  return (
    <AccordionItem
      value={feedbacks.userId ?? ""}
      className="w-full border-b-0 pt-1"
    >
      <div className="flex w-full flex-col px-1">
        <AccordionTrigger className="w-full !pt-0.5 pb-1.5 hover:!no-underline [&_>svg]:mr-3 [&_>svg]:text-muted-contrast">
          <div className="flex grow items-center justify-between px-2">
            <div className="flex items-center">
              <div className="mr-3">
                <UserDefaultImage
                  user={{ id: userId, image }}
                  dimensions="h-7 w-7 mr-1"
                />
              </div>
              <div className="text-left">
                <span className="text-sm text-contrast">{username}</span>
                <span
                  className="block text-xs font-normal text-muted-contrast hover:text-primary"
                  onClick={() => {
                    window.open(
                      `mailto:${email}?subject=Feedback-Received`,
                      "_blank",
                    );
                  }}
                >
                  {email}
                  <ExternalLink className="relative top-[-1px] ml-1 inline h-[11px] w-[11px]" />
                </span>
              </div>
            </div>
            <span className="text-xl">{emoji_?.emoji}</span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="mb-1 rounded-md text-left text-xs  [&_>div]:pb-0">
          <div className="p-2">
            <p>{feedbacks.text}</p>
            <div className="mt-1 text-muted-contrast">
              <p>
                {t("course_header_review_feedback_updated_at")}{" "}
                {dayjs(feedbacks.updatedAt).format("DD. MMM dddd")}
              </p>
            </div>
          </div>
        </AccordionContent>
      </div>
    </AccordionItem>
  );
};

export default FeedbackItem;
