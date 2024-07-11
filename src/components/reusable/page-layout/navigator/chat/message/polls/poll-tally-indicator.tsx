import React from "react";
import classNames from "@/src/client-functions/client-utils";

type Props = {
  isVoted: boolean;
  width: number;
  isLoading: boolean;
};

export default function PollTallyIndicator({
  isVoted,
  width,
  isLoading,
}: Props) {
  return (
    <div
      className={classNames(
        "absolute -left-[1px] z-[1] h-full rounded-md border-r transition-all duration-300",
        !width && "!border-transparent !bg-transparent",
        isVoted
          ? classNames(isLoading ? "bg-primary/40" : "bg-primary")
          : "bg-muted/30",
      )}
      style={{
        width: `${width}%`,
      }}
    />
  );
}
