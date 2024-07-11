import { Label } from "../../../reusable/shadcn-ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../reusable/shadcn-ui/select";
import TruncateHover from "../../../reusable/truncate-hover";

export default function DurationSelector({
  duration,
  setDuration,
}: {
  duration: 2 | 1 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | undefined;
  setDuration: (
    Val: 2 | 1 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | undefined,
  ) => void;
}) {
  if (!duration) return <></>;
  return (
    <div className="grid grid-cols-3 items-center gap-4">
      <Label htmlFor="type">{"Amount of Subscription Months"}</Label>
      <div className="col-span-2">
        <Select
          value={duration.toString()}
          onValueChange={(
            value:
              | "1"
              | "2"
              | "3"
              | "4"
              | "5"
              | "6"
              | "7"
              | "8"
              | "9"
              | "10"
              | "11"
              | "12",
          ) =>
            setDuration(
              parseInt(value) as
                | 1
                | 2
                | 3
                | 4
                | 5
                | 6
                | 7
                | 8
                | 9
                | 10
                | 11
                | 12,
            )
          }
        >
          <SelectTrigger className="h-8 w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {[
                "1",
                "2",
                "3",
                "4",
                "5",
                "6",
                "7",
                "8",
                "9",
                "10",
                "11",
                "12",
              ].map((item, index) => (
                <SelectItem value={item} key={index}>
                  <TruncateHover text={item} truncateAt={20} />
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
