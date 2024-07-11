import React from "react";
import classNames from "@/src/client-functions/client-utils";

type Props = {
  endTime: string;
  gridColumn?: string;
  gridRow?: string;
  isDragValid: boolean;
  startTime: string;
};

/**
 * Renders a box to indicate the selected (dragged) time range
 */
const DragTimeRangeBox = ({
  endTime,
  gridColumn,
  gridRow,
  isDragValid,
  startTime,
}: Props) => {
  if (!isDragValid) return null;
  return (
    <div
      style={{
        gridColumn,
        gridRow,
      }}
      className={classNames("relative z-50 rounded-md bg-muted/60")}
    >
      <div className="absolute bottom-2 right-2 flex select-none flex-col gap-2 text-xs text-muted-contrast">
        {startTime}
        {" - "}
        {endTime}
      </div>
    </div>
  );
};

export default DragTimeRangeBox;
