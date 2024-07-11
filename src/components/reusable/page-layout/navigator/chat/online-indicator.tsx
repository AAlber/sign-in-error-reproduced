import clsx from "clsx";
import React from "react";

const OnlineIndicator: React.FC<{
  absolutePosition?: string;
  dimensions?: string;
  isOnline?: boolean;
  showOffline?: boolean;
}> = (props) => {
  const {
    absolutePosition = "-bottom-[0px] right-[4px]",
    dimensions = "h-[7px] w-[7px]",
    isOnline = true,
    showOffline = true,
  } = props;

  return (
    <div
      className={clsx(
        "absolute z-10 flex items-center justify-center rounded-full",
        dimensions,
        absolutePosition,
        isOnline
          ? "bg-emerald-500 shadow-[0_0px_0px_1px_rgba(0,180,0,0.8)]"
          : showOffline
          ? "bg-red-500 shadow-[0_0px_0px_1px_rgba(220,0,0,0.9)]"
          : "",
      )}
    />
  );
};

export default OnlineIndicator;
