import { useState } from "react";
import classNames from "@/src/client-functions/client-utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/src/components/reusable/shadcn-ui/popover";

type Color = {
  name: string;
  hex: string;
  bgColor?: string;
};

const colors: Color[] = [
  { name: "red", hex: "#ef233c", bgColor: "bg-destructive" },
  { name: "orange", hex: "#fca311", bgColor: "bg-orange-500" },
  { name: "yellow", hex: "#fcca46", bgColor: "bg-yellow-500" },
  { name: "emerald", hex: "#8ac926", bgColor: "bg-emerald-500" },
  { name: "blue", hex: "#00b4d8", bgColor: "bg-blue-500" },
  { name: "indigo", hex: "#7209b7", bgColor: "bg-indigo-500" },
];

type ColorSelectorProps = {
  color: string;
  onChange: (color: string) => void;
  children: React.ReactNode;
};

export default function ColorSelector(props: ColorSelectorProps) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>{props.children}</PopoverTrigger>
      <PopoverContent className="p-0" side="bottom" align="start">
        <div className="flex items-center justify-between gap-2 p-2">
          {colors.map((color) => (
            <div
              key={color.name}
              className={classNames(
                "h-7 w-7 cursor-pointer rounded-full border",
                props.color === color.name
                  ? "border-black dark:border-white"
                  : "border-border",
                color.bgColor,
              )}
              onClick={() => {
                props.onChange(color.name);
                setOpen(false);
              }}
            />
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
