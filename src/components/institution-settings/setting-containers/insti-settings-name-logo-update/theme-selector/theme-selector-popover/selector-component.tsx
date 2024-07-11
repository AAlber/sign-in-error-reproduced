import { themes } from "@/src/client-functions/client-institution-theme";
import useThemeStore from "@/src/components/dashboard/navigation/primary-sidebar/user-menu/theme-switcher/zustand";
import ColorItem from "./color-item";
import CustomThemeButton from "./custom-theme-button";
import ColorPicker from "./theme-color-picker";
import ThemeSwitcher from "./theme-switcher";

export default function SelectorComponent() {
  const { instiTheme } = useThemeStore();

  return (
    <div className="relative flex flex-col gap-4 divide-y divide-border overflow-y-scroll ">
      <div className="flex flex-col gap-4 divide-y divide-border">
        <div className="mt-4 grid grid-cols-3 gap-2">
          {themes.map((theme) => (
            <ColorItem theme={theme} key={theme.name} />
          ))}
          <CustomThemeButton />
        </div>
        {instiTheme === "custom" && <ColorPicker />}
      </div>
      <ThemeSwitcher />
    </div>
  );
}
