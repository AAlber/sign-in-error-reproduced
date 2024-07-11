import { Switch as TailwindSwitch } from "@headlessui/react";
import { verifyContrast } from "@/src/client-functions/client-institution-theme";
import classNames from "@/src/client-functions/client-utils";
import useThemeStore from "../../dashboard/navigation/primary-sidebar/user-menu/theme-switcher/zustand";

export default function Switch({
  checked,
  disabled = false,
  onChange,
}: {
  checked: boolean;
  disabled?: boolean;
  onChange: (checked: boolean) => void;
}) {
  const { instiTheme } = useThemeStore();

  return (
    <TailwindSwitch
      checked={checked}
      onChange={onChange}
      disabled={disabled}
      className={classNames(
        checked
          ? verifyContrast(instiTheme)
            ? "bg-primary/50"
            : "bg-primary"
          : "bg-border",
        "relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:border-primary focus:outline-none focus:ring-0 ",
      )}
    >
      <span className="sr-only">Switch</span>
      <span
        aria-hidden="true"
        className={classNames(
          checked ? "translate-x-4" : "translate-x-0",
          "pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
        )}
      />
    </TailwindSwitch>
  );
}
