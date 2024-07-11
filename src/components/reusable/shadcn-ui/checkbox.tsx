import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { CheckIcon } from "@radix-ui/react-icons"; // Replace with actual import paths
import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";
import { Asterisk, X } from "lucide-react";
import * as React from "react";
import classNames from "@/src/client-functions/client-utils";

const checkboxVariants = cva(
  "peer flex shrink-0 items-center justify-center rounded-sm border focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "h-4 w-4 border-border data-[state=checked]:border-primary data-[state=checked]:bg-primary/70 data-[state=checked]:text-contrast",
        destructive:
          "data-[state=checked]border-destructive h-4 w-4 border-border data-[state=checked]:border-destructive data-[state=checked]:bg-destructive/70 data-[state=checked]:text-contrast",
        muted:
          "data-[state=checked]border-muted h-4 w-4 border-border data-[state=checked]:border-muted data-[state=checked]:bg-muted/70 data-[state=checked]:text-contrast",
        positive:
          "data-[state=checked]border-positive h-4 w-4 border-border data-[state=checked]:border-positive data-[state=checked]:bg-positive/70 data-[state=checked]:text-contrast",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface CheckboxProps
  extends React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>,
    VariantProps<typeof checkboxVariants> {
  icon?: "check" | "cross" | "line";
}

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  CheckboxProps
>(({ className, variant, icon = "check", ...props }, ref) => {
  const iconComponent = {
    check: <CheckIcon className="h-4 w-4" />,
    cross: <X className="h-4 w-4" />, // Adjust with the actual component and styles
    line: <Asterisk className="h-4 w-4" />, // Adjust with the actual component and styles
  };

  return (
    <CheckboxPrimitive.Root
      ref={ref}
      className={classNames(checkboxVariants({ variant, className }))}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        className={classNames("flex items-center justify-center text-current")}
      >
        {iconComponent[icon]}
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
});

Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox, checkboxVariants };
