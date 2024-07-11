import { NumberInput } from "../../../reusable/number-input";
import { Label } from "../../../reusable/shadcn-ui/label";

interface NumberInputFieldProps {
  label: string;
  value?: number;
  setValue: (value?: number) => void;
  min: number;
  max: number;
}

export default function NumberInputField({
  label,
  value,
  setValue,
  min,
  max,
}: NumberInputFieldProps) {
  return (
    <div className="grid grid-cols-3 items-center">
      <Label htmlFor="name">{label}</Label>
      <div className="col-span-2 flex flex-row items-center justify-center">
        <NumberInput
          value={value}
          className="w-full"
          setValue={setValue}
          min={min}
          max={max}
        />
      </div>
    </div>
  );
}
