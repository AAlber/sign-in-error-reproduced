import Skeleton from "@/src/components/skeleton";
import QuestionAnswerWrapper from "../question-answer-wrapper";

export default function QuestionSkeletons() {
  return (
    <>
      {new Array(5).fill(0).map((_, index) => (
        <QuestionAnswerWrapper isLoading key={index}>
          <Skeleton />
        </QuestionAnswerWrapper>
      ))}
    </>
  );
}
