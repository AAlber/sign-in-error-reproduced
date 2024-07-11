import React from "react";

export default function LeftBorderPlaceholder({
  iterations = 100,
}: {
  iterations?: number;
}) {
  return (
    <div className="pointer-events-none absolute left-0 top-0 h-full w-full overflow-hidden rounded-md">
      {Array.from({ length: iterations }).map((_, idx) => (
        <React.Fragment key={idx}>
          <div className="h-[10px] w-[0.23rem] bg-muted-contrast" />
          <div className="h-[10px] w-[0.23rem]" />
        </React.Fragment>
      ))}
    </div>
  );
}
