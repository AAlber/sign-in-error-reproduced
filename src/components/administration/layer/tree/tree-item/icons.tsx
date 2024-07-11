import { ClockIcon } from "@heroicons/react/20/solid";
import clsx from "clsx";
import React from "react";
import { LayerIcon } from "@/src/components/reusable/course-layer-icons";

interface Props {
  hasTimeSpan: boolean;
  hasChildren: boolean;
}

const LayerIcons: React.FC<Props> = (props) => {
  const { hasTimeSpan, hasChildren } = props;
  return (
    <div className="relative ml-1">
      {hasTimeSpan && (
        <div className="absolute -bottom-0.5 right-1 flex h-[13.5px] w-[13.5px] items-center justify-center rounded-full bg-foreground">
          <ClockIcon
            className={clsx(
              "h-3 w-3",
              hasChildren ? "text-primary" : "text-muted-contrast",
            )}
            aria-hidden="true"
          />
        </div>
      )}
      <LayerIcon
        className={clsx(
          "mr-2 h-7 w-7",
          hasChildren ? "text-contrast" : "text-muted-contrast",
        )}
      />
    </div>
  );
};

export default React.memo(LayerIcons);
