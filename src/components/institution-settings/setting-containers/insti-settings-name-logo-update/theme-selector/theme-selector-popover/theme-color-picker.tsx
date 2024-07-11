import { useTheme } from "next-themes";
import { useEffect } from "react";
import { HexColorPicker } from "react-colorful";
import { useTranslation } from "react-i18next";
import { setCustomCSSVars } from "@/src/client-functions/client-institution-theme";
import useThemeStore from "@/src/components/dashboard/navigation/primary-sidebar/user-menu/theme-switcher/zustand";
import { Input } from "@/src/components/reusable/shadcn-ui/input";
import { Label } from "@/src/components/reusable/shadcn-ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/src/components/reusable/shadcn-ui/popover";

export default function ColorPicker() {
  const { customTheme, setCustomTheme, setThemeChanged } = useThemeStore();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const { t } = useTranslation("page");

  useEffect(() => {
    setCustomCSSVars(customTheme, isDark);
  }, [customTheme]);

  return (
    <Popover>
      <PopoverTrigger className="flex items-center justify-between gap-4 pt-4">
        <Label className="flex flex-col gap-1 text-start">
          <span>{t("color_code")}</span>
          <span className="text-xs font-normal text-muted-contrast">
            {t("color_code_description")}
          </span>
        </Label>
        <div className="flex items-center gap-2 rounded-md border border-border p-2">
          <div
            className="h-5 w-5 rounded-full"
            style={{ backgroundColor: customTheme }}
          />
          <span className="text-sm uppercase">{customTheme}</span>
        </div>
      </PopoverTrigger>
      <PopoverContent>
        <div className="flex flex-col gap-2">
          <Input
            data-testid="colorpicker-input"
            maxLength={7}
            value={customTheme}
            className="max-w-[200px]"
            onChange={(e) => setCustomTheme(e.target.value)}
          />
          <HexColorPicker
            className="!w-full !rounded-lg !border !border-border"
            color={customTheme}
            onChange={(color) => {
              setCustomTheme(color);
              setThemeChanged(true);
            }}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}
