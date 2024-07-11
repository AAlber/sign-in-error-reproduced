import type { Header } from "@tanstack/react-table";
import React from "react";
import classNames from "@/src/client-functions/client-utils";

type Props<T, V> = {
  header: Header<T, V>;
};

export default function ColumnResizeHandler<T, V>({ header }: Props<T, V>) {
  return (
    <div
      onDoubleClick={() => {
        header.column.resetSize();
      }}
      onMouseDown={header.getResizeHandler()}
      onTouchStart={header.getResizeHandler()}
      className={classNames(
        "absolute -right-1 top-0 z-[2] h-full w-1.5 cursor-col-resize touch-auto select-none transition-colors",
        header.column.getIsResizing()
          ? "bg-primary"
          : "bg-transparent hover:bg-primary/50",
      )}
    />
  );
}
