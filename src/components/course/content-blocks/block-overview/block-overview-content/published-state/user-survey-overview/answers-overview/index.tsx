import { useEffect, useState } from "react";
import contentBlockHandler from "@/src/client-functions/client-contentblock/handler";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/src/components/reusable/shadcn-ui/accordion";
import type { ContentBlockUserStatus } from "@/src/types/content-block/types/user-data.types";
import type { ContentBlock } from "@/src/types/course.types";
import { SurveySelectQuestionOverview } from "./select-question-overview";
import { SurveyTextQuestionOverview } from "./text-question-overview";

export const SurveyAnswersOverview = ({
  block,
}: {
  block: ContentBlock<"Survey">;
}) => {
  const { questions } = block.specs;
  const [surveyUserData, setSurveyUserData] = useState<
    ContentBlockUserStatus<"Survey">[]
  >([]);
  const [loading, setLoading] = useState(true);

  const fetchSurveyUserData = async () => {
    const data = await contentBlockHandler.userStatus.getForBlock<"Survey">(
      block.id,
      true,
    );
    setSurveyUserData(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchSurveyUserData();
  }, [block.id]);

  return (
    <div className="relative flex h-full w-full flex-col rounded-md border border-border">
      <Accordion type="single" collapsible className="divide-y ">
        {questions.map((question) => {
          return (
            <AccordionItem
              value={question.id}
              key={question.id}
              className="border-0"
            >
              <AccordionTrigger className="border-0 border-border px-4 data-[state=open]:!border-b">
                {question.question}
              </AccordionTrigger>
              <AccordionContent className="px-4 pt-4">
                {question.type === "selection" && (
                  <SurveySelectQuestionOverview
                    question={question}
                    userData={surveyUserData}
                    loading={loading}
                  />
                )}
                {question.type === "text" && (
                  <SurveyTextQuestionOverview
                    block={block}
                    question={question}
                    userData={surveyUserData}
                    loading={loading}
                  />
                )}
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
};
