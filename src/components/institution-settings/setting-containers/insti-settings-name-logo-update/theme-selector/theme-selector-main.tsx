import { useTranslation } from "react-i18next";
import { getCurrentTheme } from "@/src/client-functions/client-institution-theme";
import useThemeStore from "@/src/components/dashboard/navigation/primary-sidebar/user-menu/theme-switcher/zustand";
import PaletteSelectorPopover from "./theme-selector-popover";

export default function ThemeSelectorMain() {
  const { t } = useTranslation("page");
  const { instiTheme } = useThemeStore();
  const color = getCurrentTheme(instiTheme);

  if (typeof window === "undefined") return null;

  return (
    <PaletteSelectorPopover>
      <div className="relative col-span-full flex items-center gap-4 rounded-md border border-border p-2 hover:bg-accent/50">
        <div className="relative h-5 w-5 overflow-hidden rounded-full border border-border">
          <div className={`h-full w-full bg-primary`}></div>
        </div>
        <div className="flex flex-col gap-2">
          <h1 className="flex gap-2 text-sm">
            {t("theme_settings_current")}{" "}
            <span className="text-primary first-letter:uppercase">
              {color?.label}
            </span>
          </h1>
        </div>
      </div>
    </PaletteSelectorPopover>
  );
}
