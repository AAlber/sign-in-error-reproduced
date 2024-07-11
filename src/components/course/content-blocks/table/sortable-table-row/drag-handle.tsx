import { GripVertical } from "lucide-react";
import React from "react";
import classNames from "@/src/client-functions/client-utils";

type Props = {
  disabled?: boolean;
} & React.ComponentPropsWithoutRef<"span">;
const DragHandle = React.forwardRef<HTMLSpanElement, Props>(
  ({ disabled, ...props }, ref) => {
    return (
      <span
        data-testid="drag-handle"
        ref={ref}
        {...(disabled ? {} : props)}
        className={classNames(
          "inline-block w-5 text-muted-contrast/70 transition-all",
          disabled
            ? "cursor-wait opacity-50"
            : "cursor-ns-resize hover:text-contrast/100 dark:hover:text-muted-contrast/100",
        )}
      >
        <GripVertical className="h-5 w-5" />
      </span>
    );
  },
);

DragHandle.displayName = "Drag Handle";
export default DragHandle;
