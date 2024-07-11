import { X } from "lucide-react";
import React from "react";

export default function CancelButton({
  onClick,
}: React.ComponentProps<"button">) {
  return (
    <button
      className="absolute -right-2 -top-2 z-[30] rounded-full border border-border bg-muted p-0.5 text-muted-contrast opacity-0 hover:text-contrast group-hover:opacity-100"
      onClick={onClick}
    >
      <X size={16} />
    </button>
  );
}
