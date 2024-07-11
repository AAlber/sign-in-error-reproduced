import clsx from "clsx";
import * as React from "react";

const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, type = "text", ...props }, ref) => {
  return (
    <input
      type={type}
      className={clsx(
        "flex h-8 w-full rounded-md border border-border/50 bg-foreground px-3 py-1 text-sm text-contrast outline-none transition-colors placeholder:text-muted focus:!border-primary focus:outline-none focus:ring-0 disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      ref={ref}
      {...props}
    />
  );
});
Input.displayName = "Input";

export { Input };
