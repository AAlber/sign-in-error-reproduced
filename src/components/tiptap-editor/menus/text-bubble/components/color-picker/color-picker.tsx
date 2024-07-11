import { Undo } from "lucide-react";
import { useCallback, useState } from "react";
import { HexColorPicker } from "react-colorful";
import classNames from "@/src/client-functions/client-utils";
import { Input } from "@/src/components/reusable/shadcn-ui/input";

interface Props {
  currentColor?: string;
  onColorChange: (color: string) => void;
  onClearColor: () => void;
}

const SampleColors: string[] = [
  "#fb7185",
  "#fdba74",
  "#d9f99d",
  "#a7f3d0",
  "#a5f3fc",
  "#a5b4fc",
];

export const ColorPicker = ({
  currentColor,
  onColorChange,
  onClearColor,
}: Props) => {
  const [colorInput, setColorInput] = useState<string>(currentColor || "");

  const handleColorInputChange = useCallback(() => {
    const isCorrectColor = /^#([0-9A-F]{3}){1,2}$/i.test(colorInput);

    if (!isCorrectColor) return;

    onColorChange(colorInput);
  }, [colorInput, onColorChange]);

  return (
    <div className="flex flex-col gap-y-3">
      <HexColorPicker
        className="w-full"
        color={currentColor}
        onChange={onColorChange}
      />
      <Input
        value={colorInput}
        onChange={(e) => setColorInput(e.target.value)}
        onBlur={handleColorInputChange}
        placeholder="#000000"
      />
      <div className="flex flex-wrap gap-x-4">
        {SampleColors.map((color) => (
          <button
            key={color}
            onClick={() => onColorChange(color)}
            style={{ backgroundColor: color }}
            className={classNames(
              "h-4 w-4 ring-white hover:ring-4",
              color === currentColor && "ring-4",
            )}
          />
        ))}
        <button onClick={onClearColor}>
          <Undo className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};
