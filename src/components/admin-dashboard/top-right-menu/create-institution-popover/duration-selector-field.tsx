import { Check, X } from "lucide-react";
import classNames from "@/src/client-functions/client-utils";
import { Label } from "@/src/components/reusable/shadcn-ui/label";
import type { SubscriptionDuration } from "../../table/zustand";
import DurationSelector from "./duration-selector";

interface DurationSelectorFieldProps {
  duration: SubscriptionDuration;
  setDuration: (value: SubscriptionDuration) => void;
}

export default function DurationSelectorField({
  duration,
  setDuration,
}: DurationSelectorFieldProps) {
  return (
    <>
      <div className="grid grid-cols-3 items-center gap-4">
        <Label htmlFor="name">Test Trial Duration</Label>
        <div className="col-span-2 flex items-end justify-between gap-6">
          <div
            className={classNames(
              "text-sm",
              !duration ? "text-contrast" : "text-muted-contrast line-through",
            )}
          >
            Default (2 Weeks)
          </div>
          {!duration ? (
            <X
              className="size-4 cursor-pointer"
              onClick={() => {
                setDuration(1);
              }}
            />
          ) : (
            <Check
              className="size-4 cursor-pointer"
              onClick={() => {
                setDuration(undefined);
              }}
            />
          )}
        </div>
      </div>
      {duration ? (
        <DurationSelector duration={duration} setDuration={setDuration} />
      ) : (
        <></>
      )}
    </>
  );
}
