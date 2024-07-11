import { useCompletion } from "ai/react";
import clsx from "clsx";
import { Wand2 } from "lucide-react";
import { useEffect } from "react";
import { toastNotEnoughAICredits } from "@/src/client-functions/client-utils";
import api from "@/src/pages/api/api";
import Spinner from "../spinner";
import { Button } from "./shadcn-ui/button";
import { toast } from "./toaster/toast";
import WithToolTip from "./with-tooltip";

type AITextTransformerButtonProps = {
  tooltipText: string;
  variant?: "ghost" | "default";
  className?: string;
  prompt?: string;
  text: string;
  onCompletion: (completion: string) => void;
  disabled?: boolean;
};

const AITextTransformerButton = ({
  tooltipText,
  variant = "ghost",
  disabled = false,
  className = "text-muted-contrast",
  text,
  prompt = "You are a text improver bot. You review the text and then improve it and correct all the mistakes that are made. You give back a text with improved grammer and spelling in the same language as the input text. You can only give back the improved text, nothing else, and do not add quoting marks around the improved text.",
  onCompletion,
}: AITextTransformerButtonProps) => {
  const { setInput, isLoading, completion, handleSubmit } = useCompletion({
    api: api.getAIToolCompletion,
    body: { system: prompt },
    onResponse(response) {
      if (response.status === 402) {
        toastNotEnoughAICredits();
      } else if (!response.ok) {
        toast.error("unknown-error", {});
      }
    },
  });

  useEffect(() => {
    setInput(text);
  }, [text]);

  useEffect(() => {
    if (completion) onCompletion(completion);
  }, [completion]);

  return (
    <WithToolTip delay={700} disabled={isLoading} text={tooltipText}>
      <form onSubmit={handleSubmit}>
        <Button
          disabled={disabled || isLoading}
          variant={variant}
          size={"iconSm"}
          type="submit"
        >
          {isLoading ? (
            <Spinner />
          ) : (
            <Wand2
              className={clsx("size-3.5", disabled ? "text-muted" : className)}
            />
          )}
        </Button>
      </form>
    </WithToolTip>
  );
};
AITextTransformerButton.displayName = "AITextTransformerButton";

export { AITextTransformerButton };
