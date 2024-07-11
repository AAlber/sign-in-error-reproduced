/* eslint-disable tailwindcss/enforces-negative-arbitrary-values */
import moment from "moment";
import React from "react";
import { REM_FROM_TOP_OF_CONTAINER_TO_MIDNIGHT } from "./appointment-display/config";

export default function TimeDisplay({
  containerOffset,
}: {
  containerOffset: React.RefObject<HTMLDivElement>;
}) {
  const hours = Array.from({ length: 24 }, (_, i) => i);

  return (
    <div
      className="col-span-full row-start-1 grid"
      style={{ gridTemplateRows: `repeat(48, minmax(2.5rem, 1fr))` }}
    >
      <div
        ref={containerOffset}
        style={{
          height: `${REM_FROM_TOP_OF_CONTAINER_TO_MIDNIGHT}rem`,
        }}
        className="row-end-1"
      />
      {hours.map((hour, index) => {
        const timeToCheck = moment().hour(hour).minute(0);
        return (
          <React.Fragment key={index}>
            <div>
              <div
                className={`sticky left-0 w-full border-b border-border pr-2 text-right text-xs leading-5 text-muted-contrast`}
              >
                <div className="absolute -left-11 -top-[9.5px] flex items-center gap-1">
                  {timeToCheck.format("HH:mm")}
                  <div className="h-[1px] w-[12px] bg-border" />
                </div>
              </div>
            </div>
            <div />
          </React.Fragment>
        );
      })}
    </div>
  );
}
