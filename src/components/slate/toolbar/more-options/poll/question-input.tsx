import React from "react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Input } from "@/src/components/reusable/shadcn-ui/input";
import { Label } from "@/src/components/reusable/shadcn-ui/label";
import type { PollSchemaType } from "@/src/types/chat/polls";

export default function QuestionInput() {
  const { t } = useTranslation("page");
  const { register } = useFormContext<PollSchemaType>();

  return (
    <div className="grid gap-2">
      <Label>{t("chat.poll.create_poll.question")}</Label>
      <Input
        {...register("question")}
        autoComplete="off"
        placeholder={t("chat.poll.create_poll.placeholder.ask_question")}
      />
    </div>
  );
}
