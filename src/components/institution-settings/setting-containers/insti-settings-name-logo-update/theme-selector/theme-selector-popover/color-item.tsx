import { cx } from "class-variance-authority";
import { CheckIcon } from "lucide-react";
import type { Theme } from "@/src/client-functions/client-institution-theme";
import useThemeStore from "@/src/components/dashboard/navigation/primary-sidebar/user-menu/theme-switcher/zustand";
import { Button } from "@/src/components/reusable/shadcn-ui/button";

export default function ColorItem({ theme }: { theme: Theme }) {
  const { instiTheme, setInstiTheme, setThemeChanged } = useThemeStore();
  const isActive = instiTheme === theme.name;

  return (
    <>
      {theme.name !== "custom" && (
        <Button
          variant={"outline"}
          key={theme.name}
          onClick={() => {
            setInstiTheme(theme.name);
            setThemeChanged(true);
          }}
          className={cx(
            "justify-start",
            isActive ? "border border-primary" : "",
          )}
          style={
            {
              "--theme-primary": `hsl(${
                theme?.activeColor.dark || theme?.activeColor.light
              })`,
            } as React.CSSProperties
          }
        >
          <span
            className={cx(
              "mr-1 flex h-4 w-4 shrink-0 -translate-x-1 items-center justify-center rounded-full bg-[--theme-primary]",
            )}
          >
            {isActive && <CheckIcon className="h-3 w-3 text-contrast" />}
          </span>
          <span className="text-contrast">{theme.label}</span>
        </Button>
      )}
    </>
  );
}
