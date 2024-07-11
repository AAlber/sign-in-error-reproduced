import { useForm } from "react-hook-form";
import ControlledInput from "@/src/components/workbench-deprecated/components/controlled-input";
import type { SurveyLogic } from "../../..";
import { updateLogics } from "../../functions";

type LogicLinkField = {
  link: string;
};

export default function LogicLinkInput({
  elementId,
  logic,
}: {
  elementId: string;
  logic: SurveyLogic;
}) {
  const { control, handleSubmit } = useForm<LogicLinkField>({
    defaultValues: { link: logic.actionLink },
  });

  const handleUpdate = (val: LogicLinkField) => {
    updateLogics(elementId, logic.id, { actionLink: val.link });
  };

  //TODO: validate link
  return (
    <ControlledInput
      control={control}
      name="link"
      type="input"
      containerProps={{
        className: "w-full",
      }}
      inputProps={{
        maxLength: 1000,
        onBlur: handleSubmit(handleUpdate),
        placeholder: "https://example.com",
        className:
          "flex flex-grow select-auto resize-none justify-start rounded-md border border-border bg-background px-2 py-1 text-contrast outline-none ring-0 placeholder:text-muted-foregorund focus:outline-none focus:ring-0  w-full",
      }}
    />
  );
}
