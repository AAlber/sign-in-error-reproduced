import { GripVertical } from "lucide-react";
import type { ClassAttributes, HTMLAttributes } from "react";

type Props = ClassAttributes<HTMLSpanElement> &
  HTMLAttributes<HTMLSpanElement> & {
    id: string;
    isInTheStore: boolean;
  };

const DragHandle = ({ isInTheStore: _isInTheStore, ...props }: Props) => {
  return (
    <span
      {...props}
      className="inline-block w-5 cursor-move text-offwhite-5 transition-colors duration-300 ease-in-out hover:text-offblack-5 dark:text-offwhite-3 dark:hover:text-offwhite-5"
    >
      <GripVertical size={18} />
    </span>
  );
};

export default DragHandle;
