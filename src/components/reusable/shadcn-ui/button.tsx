import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { cn } from "@/src/utils/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:cursor-not-allowed disabled:border-border/50 disabled:text-muted-contrast/50",
  {
    variants: {
      variant: {
        default:
          "bg-secondary text-contrast hover:bg-accent/50 disabled:bg-accent/30",
        destructive:
          "bg-destructive text-destructive-contrast  hover:bg-destructive/40 disabled:bg-accent/30",
        cta: "bg-primary text-white hover:bg-primary/80 disabled:bg-accent/30",
        ghost: "text-contrast hover:bg-accent/50 hover:text-muted-contrast",
        link: "text-primary underline-offset-4 hover:underline",
        positive:
          "bg-positive text-positive-contrast hover:bg-positive/40 disabled:bg-accent/30",
        outline:
          "border border-border text-contrast hover:bg-accent/50 hover:text-accent-contrast",
      },
      size: {
        small: "h-6 px-2 py-1",
        default: "h-8 p-2",
        lg: "h-10 rounded-md px-4",
        icon: "size-8",
        iconSm: "size-6",
        button: "h-8 w-20",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  title?: string;
  enabled?: boolean;
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      title = "",
      enabled = true,
      className,
      variant,
      size,
      asChild = false,
      loading,
      disabled,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        type="button"
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
