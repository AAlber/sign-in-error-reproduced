import { memo, useCallback, useEffect, useState } from "react";
import { Slider } from "@/src/components/reusable/shadcn-ui/slider";

export type Props = {
  onChange: (value: number) => void;
  value: number;
};

export const ImageBlockWidth = memo(({ onChange, value }: Props) => {
  const [currentValue, setCurrentValue] = useState(value);

  useEffect(() => {
    setCurrentValue(value);
  }, [value]);

  const handleChange = useCallback(
    (value) => {
      onChange(value[0]);
    },
    [onChange],
  );

  return (
    <div className="flex items-center gap-2">
      <Slider
        value={[currentValue]}
        onValueChange={handleChange}
        min={25}
        max={100}
        step={25}
        className="w-24"
      />
      <span className="select-none text-xs font-semibold text-neutral-500">
        {value}%
      </span>
    </div>
  );
});

ImageBlockWidth.displayName = "ImageBlockWidth";
