import { ChevronDown, ChevronUp } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/src/components/reusable/shadcn-ui/button";
import { Input } from "../../../reusable/shadcn-ui/input";
import useCourseManagement from "../zustand";

type GoalPointsProps = {
  onPointsChange: (newPoints: number) => void;
};

export default function GoalPoints({ onPointsChange }: GoalPointsProps) {
  const { points } = useCourseManagement();
  const [value, setValue] = useState(points);

  useEffect(() => {
    setValue(points);
  }, [points]);

  useEffect(() => {
    onPointsChange(value);
  }, [value, onPointsChange]);

  return (
    <ul className="flex items-center justify-end gap-2">
      <Input
        type="number"
        className="h-32 w-36 text-center text-5xl font-bold"
        value={value}
        max={100}
        min={0}
        onChange={(e) => {
          const strVal = e.target.value;
          const val = parseInt(strVal);
          setValue(
            val > 100
              ? Math.floor(val / 10)
              : val < 0 || strVal.startsWith("0")
              ? 0
              : val,
          );
        }}
      />
      <li className="flex flex-col gap-2">
        <Button
          onClick={() => setValue((val) => val + 1)}
          disabled={value === 100}
          size={"icon"}
          className="h-7"
        >
          <ChevronUp className="h-6 w-6 text-muted-contrast" />
        </Button>
        <Button
          onClick={() => setValue((val) => val - 1)}
          disabled={value === 0}
          size={"icon"}
          className="h-7"
        >
          <ChevronDown className="h-6 w-6 text-muted-contrast" />
        </Button>
      </li>
    </ul>
  );
}
