"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "../../../../../reusable/shadcn-ui/dropdown-menu";
import useThemeStore from "./zustand";

export function ThemeSwitcher() {
  const { setTheme, resolvedTheme } = useTheme();
  const { setLocalTheme } = useThemeStore();
  const { t } = useTranslation("page");
  const isDark = resolvedTheme === "dark";

  useEffect(() => {
    setLocalTheme(resolvedTheme!);
  }, [resolvedTheme]);

  return (
    <DropdownMenuSub>
      <DropdownMenuSubTrigger>
        <div className="flex items-center gap-2">
          <Sun size={18} className="dark:hidden" />
          <Moon size={18} className="hidden dark:flex" />
          {t("theme") + ": " + t(isDark ? "dark" : "light")}
        </div>
      </DropdownMenuSubTrigger>
      <DropdownMenuSubContent>
        <DropdownMenuItem onClick={() => setTheme("light")}>
          <Sun size={18} />
          {t("light")}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          <Moon size={18} />

          {t("dark")}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          <Monitor size={18} />
          {t("system")}
        </DropdownMenuItem>
      </DropdownMenuSubContent>
    </DropdownMenuSub>
  );
}
