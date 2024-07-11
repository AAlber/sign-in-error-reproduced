import React from "react";
import Skeleton from "@/src/components/skeleton";

export default function LoadingMessages() {
  return (
    <>
      {new Array(6).fill(0).map((_, i) => (
        <div
          key={i}
          className={`flex w-full items-end gap-2 ${
            i % 2 !== 0 ? "justify-start" : "justify-end"
          }`}
        >
          <div
            style={{
              height: i % 2 !== 0 ? `${Math.random() * 5 + 4}rem` : "2.5rem",
            }}
            className={`h-10 max-w-[75%] overflow-hidden bg-accent/50 ${
              i % 2 !== 0
                ? "rounded-b-lg rounded-r-lg"
                : "rounded-t-lg rounded-bl-lg"
            }`}
          >
            <Skeleton />
          </div>
          {i % 2 === 0 && (
            <div className="h-7 w-7 rounded-full border border-border bg-foreground" />
          )}
        </div>
      ))}
    </>
  );
}
