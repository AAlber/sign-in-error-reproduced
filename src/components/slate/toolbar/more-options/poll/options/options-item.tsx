import { MinusIcon } from "lucide-react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Button } from "@/src/components/reusable/shadcn-ui/button";
import { Input } from "@/src/components/reusable/shadcn-ui/input";
import type { PollSchemaType } from "@/src/types/chat/polls";

type Props = {
  index: number;
  onClick: () => void;
};

export function OptionItem({ index, onClick }: Props) {
  const { t } = useTranslation("page");
  const { register } = useFormContext<PollSchemaType>();

  return (
    <div className="flex gap-2">
      <Input
        {...register(`options.${index}.text`)}
        placeholder={t("chat.poll.create_poll.placeholder.add")}
      />

      <Button onClick={onClick}>
        <MinusIcon className="size-4" />
      </Button>
    </div>
  );
}
