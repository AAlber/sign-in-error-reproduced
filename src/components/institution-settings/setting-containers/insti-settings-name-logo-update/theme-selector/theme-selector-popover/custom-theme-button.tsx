import { cx } from "class-variance-authority";
import { Palette } from "lucide-react";
import { useTheme } from "next-themes";
import { setCustomCSSVars } from "@/src/client-functions/client-institution-theme";
import useThemeStore from "@/src/components/dashboard/navigation/primary-sidebar/user-menu/theme-switcher/zustand";
import { Button } from "@/src/components/reusable/shadcn-ui/button";

export default function CustomThemeButton() {
  const { instiTheme, customTheme, setInstiTheme, setThemeChanged } =
    useThemeStore();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const handleClick = () => {
    setInstiTheme("custom");
    setCustomCSSVars(customTheme, isDark);
    setThemeChanged(true);
  };

  return (
    <div className="col-span-3 ">
      <Button
        variant={"outline"}
        className={cx(
          "w-full",
          instiTheme === "custom" ? "border border-primary" : "",
        )}
        onClick={handleClick}
      >
        <Palette className="mr-1 h-4 w-4 -translate-x-1 text-contrast" />
        <span className="text-contrast">Custom Theme</span>
      </Button>
    </div>
  );
}
