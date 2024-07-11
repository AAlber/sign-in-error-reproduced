import type { UseAssistantHelpers } from "ai/react";
import { useTranslation } from "react-i18next";
import { Button } from "@/src/components/reusable/shadcn-ui/button";
import { handleSubmit } from "../functions";
import useAutoLessonChat from "../zustand";

export function SubmitButton({
  assistant,
}: {
  assistant: UseAssistantHelpers;
}) {
  const { selectedAnswer } = useAutoLessonChat();
  const { t } = useTranslation("page");

  return (
    <Button
      variant={"cta"}
      disabled={!selectedAnswer?.text}
      onClick={() => handleSubmit(assistant)}
    >
      {t("general.submit")}
    </Button>
  );
}
