import { Circle } from "lucide-react";
import classNames from "@/src/client-functions/client-utils";

type Props = { isVoted: boolean; isMyMessage: boolean };
export function Dot({ isMyMessage, isVoted }: Props) {
  return (
    <div
      className={classNames(
        "flex aspect-square h-4 w-4 items-center justify-center rounded-full border focus:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
        isVoted
          ? "border-muted/10 bg-muted/20 fill-contrast text-contrast"
          : "border-muted/10 bg-muted/20 fill-muted/20 text-transparent",
      )}
    >
      <Circle
        className={classNames(
          "h-2.5 w-2.5",
          isVoted
            ? isMyMessage
              ? "fill-white"
              : "dark:fill-contast fill-white"
            : "fill-current",
        )}
      />
    </div>
  );
}
