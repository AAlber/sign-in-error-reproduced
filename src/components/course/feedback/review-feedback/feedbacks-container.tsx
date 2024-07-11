import type { getFeedback } from "@/src/client-functions/client-course";
import { Accordion } from "@/src/components/reusable/shadcn-ui/accordion";
import FeedbackItem from "./feedbacks-item";

type CourseFeedback = Awaited<ReturnType<typeof getFeedback>>;

export interface FeedbackProps {
  feedbacks: CourseFeedback;
}

const FeedbacksContainer: React.FC<FeedbackProps> = (props) => {
  const { feedbacks } = props;
  if (!Array.isArray(feedbacks)) return null;

  return (
    <div className="max-h-[60vh] overflow-y-scroll">
      <Accordion type="single" collapsible className="divide-y divide-border">
        {feedbacks.map((i) => (
          <FeedbackItem feedbacks={i} key={i.id} />
        ))}
      </Accordion>
    </div>
  );
};

export default FeedbacksContainer;
