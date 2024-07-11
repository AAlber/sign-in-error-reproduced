import { cva } from "class-variance-authority";
import React from "react";
import classNames from "@/src/client-functions/client-utils";

const infoCardVariants = cva(
  "flex items-center gap-2 rounded-lg border px-4 py-2 text-sm dark:bg-opacity-20",
  {
    variants: {
      variant: {
        default:
          "border border-primary bg-primary/20 text-contrast hover:bg-primary/30 disabled:border-border disabled:bg-foreground",
        destructive:
          "border border-destructive bg-destructive/20 text-destructive-contrast shadow-sm hover:bg-destructive/40 disabled:border-border disabled:bg-foreground",
        positive:
          "border border-positive bg-positive/20 text-positive-contrast shadow-sm hover:bg-positive/40 disabled:border-border disabled:bg-foreground",
        warning:
          "warning group border-warning-contrast/30 bg-warning/50 text-warning-contrast",
        neutral:
          "border border-border bg-foreground text-contrast dark:bg-opacity-10",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

const InfoCard = ({
  variant = "default",
  icon,
  children,
  rightSideComponent,
  className,
}: {
  variant?: "default" | "destructive" | "positive" | "warning" | "neutral";
  icon?: string | JSX.Element;
  children: React.ReactNode;
  rightSideComponent?: React.ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={classNames(
        infoCardVariants({ variant }),
        className,
        "justify-between",
      )}
    >
      <div className="flex items-start gap-4">
        {icon && <span className="text-lg">{icon}</span>}
        <div className="flex flex-col gap-0.5">{children}</div>
      </div>
      {rightSideComponent && rightSideComponent}
    </div>
  );
};

const Title = ({ children }: { children: React.ReactNode }) => (
  <span className="font-medium">{children}</span>
);
Title.displayName = "Title";

const Description = ({ children }: { children: React.ReactNode }) => (
  <span className="text-xs font-normal text-opacity-70 dark:text-opacity-70">
    {children}
  </span>
);
Description.displayName = "Description";

InfoCard.Title = Title;
InfoCard.Description = Description;

export default InfoCard;
