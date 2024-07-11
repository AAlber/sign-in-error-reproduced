import {
  Clock1,
  Clock2,
  Clock3,
  Clock4,
  Clock5,
  Clock6,
  Clock7,
  Clock8,
  Clock9,
  Clock10,
  Clock11,
  Clock12,
} from "lucide-react";
import { SelectTrigger } from "../../shadcn-ui/select";

export default function TimePickerTrigger({ value }: { value: string }) {
  const [hours] = value.split(":").map(Number);

  const getIcon = () => {
    switch (hours) {
      case 1:
      case 13:
        return <Clock1 className="mr-2 h-4 w-4 text-muted-contrast" />;
      case 2:
      case 14:
        return <Clock2 className="mr-2 h-4 w-4 text-muted-contrast" />;
      case 3:
      case 15:
        return <Clock3 className="mr-2 h-4 w-4 text-muted-contrast" />;
      case 4:
      case 16:
        return <Clock4 className="mr-2 h-4 w-4 text-muted-contrast" />;
      case 5:
      case 17:
        return <Clock5 className="mr-2 h-4 w-4 text-muted-contrast" />;
      case 6:
      case 18:
        return <Clock6 className="mr-2 h-4 w-4 text-muted-contrast" />;
      case 7:
      case 19:
        return <Clock7 className="mr-2 h-4 w-4 text-muted-contrast" />;
      case 8:
      case 20:
        return <Clock8 className="mr-2 h-4 w-4 text-muted-contrast" />;
      case 9:
      case 21:
        return <Clock9 className="mr-2 h-4 w-4 text-muted-contrast" />;
      case 10:
      case 22:
        return <Clock10 className="mr-2 h-4 w-4 text-muted-contrast" />;
      case 11:
      case 23:
        return <Clock11 className="mr-2 h-4 w-4 text-muted-contrast" />;
      case 12:
      case 0:
        return <Clock12 className="mr-2 h-4 w-4 text-muted-contrast" />;
    }
  };

  return (
    <SelectTrigger className="w-full max-w-[124px] ">
      <div className="flex items-center gap-2">
        {" "}
        {getIcon()}
        {value}
      </div>
    </SelectTrigger>
  );
}
