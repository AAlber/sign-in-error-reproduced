import React from "react";
import Skeleton from "../../skeleton";

export default function TableLoader() {
  return (
    <div className="flex flex-col gap-2 p-4">
      <div className="overflow-hidden rounded-md border border-border">
        <Skeleton />
      </div>
    </div>
  );
}
