import clsx from "clsx";
import { Button } from "@/src/components/reusable/shadcn-ui/button";

const QuestionAnswerWrapper = ({
  isLoading,
  onClick,
  children,
}: {
  isLoading?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}) => {
  return (
    <Button
      onClick={onClick}
      disabled={isLoading}
      className={clsx(
        !isLoading ? "border p-1 px-2 hover:bg-accent/30" : "border-0 p-0",
        "flex h-10 w-full items-center justify-center space-x-2 overflow-hidden rounded-md border-border text-start text-xs",
      )}
    >
      {children}
    </Button>
  );
};

export default QuestionAnswerWrapper;
