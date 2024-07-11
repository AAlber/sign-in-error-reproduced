import React from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Label } from "@/src/components/reusable/shadcn-ui/label";
import type { PollSchemaType } from "@/src/types/chat/polls";
import { AddOption } from "./add-option";
import { OptionItem } from "./options-item";

type Props = {
  newOption: string;
  setNewOption: (data: string) => void;
};

export default function Options({ newOption, setNewOption }: Props) {
  const { t } = useTranslation("page");
  const { control } = useFormContext<PollSchemaType>();
  const { append, fields, remove } = useFieldArray({
    control,
    name: "options",
  });

  return (
    <div className="grid gap-2">
      <Label>{t("chat.poll.create_poll.options")}</Label>
      <div className="grid gap-2">
        {fields.map(({ id }, index) => (
          <OptionItem key={id} index={index} onClick={() => remove(index)} />
        ))}

        <AddOption
          newOption={newOption}
          setNewOption={setNewOption}
          onAdd={(v) => append(v, { shouldFocus: false })}
        />
      </div>
    </div>
  );
}
