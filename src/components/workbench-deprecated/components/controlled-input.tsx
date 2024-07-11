import type { TextareaAutosizeProps } from "@mui/material/TextareaAutosize";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import React from "react";
import {
  type FieldValues,
  useController,
  type UseControllerProps,
} from "react-hook-form";

interface CommonProps<T extends FieldValues> extends UseControllerProps<T> {
  type: "input" | "textarea";
}

interface InputProps<T extends FieldValues> extends CommonProps<T> {
  type: "input";
  containerProps?: React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  >;
  inputProps?: React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  >;
}

interface TextAreaProps<T extends FieldValues> extends CommonProps<T> {
  type: "textarea";
  textareaProps?: TextareaAutosizeProps;
}

const Input = <T extends FieldValues>(props: InputProps<T>) => {
  const { containerProps = {}, inputProps = {}, ...rest } = props;
  const { field, fieldState } = useController(rest);
  const { onBlur, onChange, ...f } = field;
  const p = inputProps ?? {};

  const hasError = !!fieldState.error;

  const handleOnChange = (e) => {
    const { value } = e.target;

    if (!isNaN(value) && value.trim() !== "" && !value.match(/[a-z]/i)) {
      field.onChange(value);
    } else if (value.trim() === "") {
      field.onChange("");
    }

    inputProps?.onChange?.(e);
  };
  return (
    <div className="relative" {...containerProps}>
      <input type="text" {...inputProps} {...field} onChange={handleOnChange} />

      {hasError && (
        <span className="inline-block text-[10px] text-destructive">
          {fieldState.error?.message}
        </span>
      )}
    </div>
  );
};

const TextArea = <T extends FieldValues>(props: TextAreaProps<T>) => {
  const { textareaProps = {}, ...rest } = props;
  const { field } = useController(rest);
  const { onBlur, onChange, ...f } = field;
  const p = textareaProps ?? {};

  return (
    <TextareaAutosize
      {...p}
      {...f}
      onBlur={(e) => {
        textareaProps?.onBlur?.(e);
        onBlur();
      }}
      onChange={(e) => {
        onChange(e);
        textareaProps?.onChange?.(e);
      }}
    />
  );
};

const MemoizedInput = React.memo(Input) as typeof Input;
const MemoizedTextArea = React.memo(TextArea) as typeof TextArea;

const ControlledInput = <T extends FieldValues>(
  props: InputProps<T> | TextAreaProps<T>,
) => {
  switch (props.type) {
    case "input": {
      return <MemoizedInput {...props} />;
    }
    case "textarea": {
      return <MemoizedTextArea {...props} />;
    }
    default:
      return null;
  }
};

export default ControlledInput;
