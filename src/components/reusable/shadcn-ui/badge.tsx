import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import classNames from "@/src/client-functions/client-utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "rounded-sm border border-accent bg-foreground text-contrast shadow-sm hover:bg-foreground/80",
        secondary:
          "text-muted-foreground rounded-sm border-transparent bg-secondary hover:bg-secondary/80",
        destructive:
          "text-destructive-foreground rounded-sm border-transparent bg-destructive shadow-sm hover:bg-destructive/80",
        warning:
          "rounded-sm border-warning-contrast/30 bg-warning text-contrast shadow-sm hover:bg-warning/80",
        outline: "border border-border text-contrast",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div
      className={classNames(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
