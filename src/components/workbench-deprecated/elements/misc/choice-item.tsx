import { X } from "lucide-react";
import type {
  Control,
  FieldValues,
  Path,
  PathValue,
  UseFormSetValue,
} from "react-hook-form";
import { useTranslation } from "react-i18next";
import classNames from "@/src/client-functions/client-utils";
import { Button } from "@/src/components/reusable/shadcn-ui/button";
import ControlledInput from "../../components/controlled-input";
import type { ElementMetadata } from "../../types";
import useWorkbench, { WorkbenchMode } from "../../zustand";
import { type QuestionsField } from "../element-survey/element-body/question-list";

const ChoiceOption = <T extends FieldValues = ChoicesGeneric>(
  props: Props<T>,
) => {
  const {
    checked,
    control,
    displayPoints,
    index,
    onRemove,
    onUpdate,
    roundedCheckboxes = true,
    inputCheckboxName = `choices.${index}.checked` as Path<T>,
    inputTextareaTitleName = `choices.${index}.text` as Path<T>,
    inputTextPointsName = `choices.${index}.points` as Path<T>,
  } = props;

  const { mode } = useWorkbench();
  const { t } = useTranslation("page");

  return (
    <div
      onClick={onUpdate}
      onBlur={onUpdate}
      className={classNames(
        mode === WorkbenchMode.FILLOUT && "cursor-pointer hover:bg-secondary",
        "my-1 flex w-full flex-row items-center justify-start gap-x-2 rounded-md border border-border bg-foreground pl-3 pr-1",
      )}
    >
      <div className="flex w-full items-center">
        <ControlledInput
          control={control}
          name={inputCheckboxName}
          type="input"
          inputProps={{
            type: "checkbox",
            checked,
            disabled: mode !== WorkbenchMode.FILLOUT,
            onClick: (e) => e.preventDefault(),
            className: classNames(
              "h-4 w-4 border-2 border-border text-foregorund bg-foreground focus:border-transparent focus:outline-none focus:ring-0  pointer-events-none",
              roundedCheckboxes ? "rounded-full" : "rounded-sm",
            ),
          }}
        />
        <ControlledInput
          control={control}
          name={inputTextareaTitleName}
          type="textarea"
          textareaProps={{
            placeholder: `${t("workbench.element_choice")} ${index + 1}`,
            disabled: mode !== WorkbenchMode.CREATE,
            className:
              "flex w-full select-auto resize-none items-end justify-start border-transparent bg-transparent text-contrast outline-none ring-0 placeholder:text-muted focus:border-transparent focus:outline-none focus:ring-0",
          }}
        />
      </div>
      {mode === WorkbenchMode.CREATE && (
        <>
          {displayPoints && (
            <div className="flex items-center">
              <div className="-mr-1 flex w-full items-center text-muted-contrast">
                {t("workbench.element_points")}
              </div>
              <ControlledInput
                control={control}
                name={inputTextPointsName}
                type="input"
                rules={{
                  onChange: (e) => {
                    const value = e.target.value as string;
                    if (isNaN(+value)) {
                      props.setValue(
                        inputTextPointsName,
                        0 as PathValue<T, Path<T>>,
                      );
                    }
                  },
                }}
                inputProps={{
                  maxLength: 3,
                  className:
                    "flex w-12 select-auto resize-none justify-start text-contrast border-transparent bg-transparent text-right outline-none ring-0 placeholder:text-muted-foregorund focus:border-transparent focus:outline-none focus:ring-0",
                }}
              />
            </div>
          )}
          <Button
            size={"icon"}
            variant={"ghost"}
            onClick={onRemove}
            className="text-muted-contrast"
          >
            <X className="h-4 w-4" />
          </Button>
        </>
      )}
    </div>
  );
};

export default ChoiceOption;

type ChoicesGeneric =
  | {
      choices: NonNullable<ElementMetadata["choices"]>;
    }
  | QuestionsField;

interface CommonProps<T extends FieldValues> {
  checked: boolean;
  control: Control<T>;
  index: number;
  inputCheckboxName?: Path<T>;
  inputTextareaTitleName?: Path<T>;
  inputTextPointsName?: Path<T>;
  roundedCheckboxes?: boolean;
  onUpdate: () => void;
  onRemove: () => void;
}

interface WithPoints<T extends FieldValues> extends CommonProps<T> {
  displayPoints: true;
  setValue: UseFormSetValue<T>;
}

interface WithoutPoints<T extends FieldValues> extends CommonProps<T> {
  displayPoints?: false;
  setValue?: never;
}

type Props<T extends FieldValues> = WithoutPoints<T> | WithPoints<T>;
