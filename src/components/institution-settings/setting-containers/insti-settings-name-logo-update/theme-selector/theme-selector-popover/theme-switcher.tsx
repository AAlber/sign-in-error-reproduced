import { cx } from "class-variance-authority";
import { MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { useTranslation } from "react-i18next";
import useThemeStore from "@/src/components/dashboard/navigation/primary-sidebar/user-menu/theme-switcher/zustand";
import { Button } from "@/src/components/reusable/shadcn-ui/button";
import { Label } from "@/src/components/reusable/shadcn-ui/label";

export default function ThemeSwitcher() {
  const { t } = useTranslation("page");
  const { setLocalTheme } = useThemeStore();
  const { setTheme, resolvedTheme } = useTheme();

  return (
    <div className="flex w-full items-center justify-between gap-4 pt-4">
      <Label className="text-sm">{t("preview")}</Label>
      <div className="grid grid-cols-2 gap-2">
        <Button
          variant={"outline"}
          onClick={() => {
            setLocalTheme("light");
            setTheme("light");
          }}
          className={cx(
            resolvedTheme === "light"
              ? "border-2 border-primary text-contrast"
              : "text-muted-contrast",
          )}
        >
          <SunIcon className="mr-1 size-4 -translate-x-1" />
          <span>{t("navbar.theme_light")}</span>
        </Button>
        <Button
          variant={"outline"}
          onClick={() => {
            setLocalTheme("dark");
            setTheme("dark");
          }}
          className={cx(
            resolvedTheme === "dark"
              ? "border border-primary text-contrast"
              : "text-muted-contrast",
          )}
        >
          <MoonIcon className="mr-1 size-4 -translate-x-1" />
          <span>{t("navbar.theme_dark")}</span>
        </Button>
      </div>
    </div>
  );
}
