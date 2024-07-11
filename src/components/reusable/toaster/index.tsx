"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner } from "sonner";
import { withPortal } from "../../portal";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const ToasterMain = () => {
  const { theme } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      // eslint-disable-next-line tailwindcss/no-custom-classname
      className="toaster group"
      position="top-right"
      offset={16}
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-contrast group-[.toaster]:border-border group-[.toaster]:shadow-lg group-[.toaster] :pointer-events-auto",
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-contrast",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
        },
      }}
    />
  );
};

export const Toaster = withPortal(ToasterMain);
