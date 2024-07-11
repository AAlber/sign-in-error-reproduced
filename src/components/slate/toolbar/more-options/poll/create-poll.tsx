import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useChannelStateContext, useChatContext } from "stream-chat-react";
import { submitPoll } from "@/src/client-functions/client-chat/polls";
import type { StreamChatGenerics } from "@/src/components/reusable/page-layout/navigator/chat/types";
import { Button } from "@/src/components/reusable/shadcn-ui/button";
import type { PollSchemaType } from "@/src/types/chat/polls";
import { pollSchema } from "@/src/types/chat/polls";
import { AllowMultipleToggle } from "./allow-multiple-toggle";
import Options from "./options";
import QuestionInput from "./question-input";

type Props = {
  setDialogOpen: (bool: boolean) => void;
};

export default function CreatePoll({ setDialogOpen }: Props) {
  const form = useForm<PollSchemaType>({
    resolver: zodResolver(pollSchema),
  });

  const options = form.watch("options");

  const [newOption, setNewOption] = useState("");
  const { t } = useTranslation("page");
  const { client } = useChatContext();
  const { channel } = useChannelStateContext<StreamChatGenerics>();
  const { append } = useFieldArray({
    control: form.control,
    name: "options",
  });

  const disabled =
    !form.formState.isDirty ||
    !options.length ||
    !!Object.keys(form.formState.errors).length;

  return (
    <FormProvider {...form}>
      <div className="grid gap-6">
        <h3 className="text-contrast">{t("chat.poll.create_poll.title")}</h3>
        <QuestionInput />
        <Options newOption={newOption} setNewOption={setNewOption} />
        <AllowMultipleToggle />

        <div className="flex justify-end">
          <Button
            disabled={disabled}
            loading={disabled}
            variant="cta"
            onClick={(e) => {
              // if there is currently a value in the input text, include it to the options
              if (!!newOption)
                append({ text: newOption }, { shouldFocus: false });

              form.handleSubmit((value) => {
                submitPoll({
                  value,
                  currentChannel: channel,
                  getstreamClient: client,
                  onSubmit: () => setDialogOpen(false),
                });
              })(e);
            }}
          >
            {t("general.submit")}
          </Button>
        </div>
      </div>
    </FormProvider>
  );
}
