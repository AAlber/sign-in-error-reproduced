import type { TFunction } from "i18next";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useTranslation } from "react-i18next";
import { onNumberInputChange } from "@/src/client-functions/client-utils";
import { useDebounce } from "@/src/client-functions/client-utils/hooks";
import { Button } from "./shadcn-ui/button";
import { Input } from "./shadcn-ui/input";

interface NumberInputProps {
  value: number | undefined;
  setValue: (value: number | undefined) => void;
  onChange?: (value: number | undefined) => void;
  min?: number;
  max?: number;
  belowMinValueToast?: (val: number, t: TFunction<"page", undefined>) => void;
  maxValueExceededToast?: (
    val: number,
    t: TFunction<"page", undefined>,
  ) => void;
  className?: string;
  defaultValue?: number;
}

export const NumberInput: React.FC<NumberInputProps> = ({
  value,
  setValue,
  defaultValue,
  onChange,
  belowMinValueToast,
  maxValueExceededToast,
  min = 0,
  max = Number.MAX_SAFE_INTEGER,
  className = "",
}) => {
  const { t } = useTranslation("page");
  useDebounce(
    () => {
      if (onChange) return onChange(value);
      else
        onNumberInputChange({
          value,
          setValue,
          min,
          max,
          t,
          belowMinValueAction: belowMinValueToast,
          maxValueExceededAction: maxValueExceededToast,
        });
    },
    [value],
    500,
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    const numericValue = newValue.replace(/[^0-9]/g, ""); // Remove non-numeric characters
    e.target.value = numericValue;
    setValue(numericValue === "" ? undefined : Number(numericValue));
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (
      !/[0-9]/.test(event.key) &&
      event.key !== "Backspace" &&
      event.key !== "ArrowLeft" &&
      event.key !== "ArrowRight"
    ) {
      event.preventDefault();
    }
  };

  const handleIncrement = () => {
    const newValue = value === undefined ? min : Math.min(value + 1, max);
    if (onChange) return onChange(newValue);
    onNumberInputChange({
      value: newValue,
      setValue,
      min,
      max,
      t,
      belowMinValueAction: belowMinValueToast,
      maxValueExceededAction: maxValueExceededToast,
    });
  };

  const handleDecrement = () => {
    const newValue = value === undefined ? min : Math.max(value - 1, min);
    if (onChange) return onChange(newValue);
    onNumberInputChange({
      value: newValue,
      setValue,
      min,
      max,
      t,
      belowMinValueAction: belowMinValueToast,
      maxValueExceededAction: maxValueExceededToast,
    });
  };

  return (
    <div className={`min-w-50 relative flex flex-col items-end ${className}`}>
      <Input
        type="number"
        defaultValue={defaultValue}
        value={value}
        onKeyDown={handleKeyDown}
        onChange={handleChange}
        min={min}
        max={max}
        className="w-[100px] pr-8"
      />
      <div className="absolute top-0.5 flex flex-col">
        <Button
          size={"iconSm"}
          variant={"ghost"}
          onClick={handleIncrement}
          className="h-auto !p-0"
        >
          <ChevronUp size={14} />
        </Button>
        <Button
          size={"iconSm"}
          variant={"ghost"}
          onClick={handleDecrement}
          className="h-auto !p-0"
        >
          <ChevronDown size={14} />
        </Button>
      </div>
    </div>
  );
};
