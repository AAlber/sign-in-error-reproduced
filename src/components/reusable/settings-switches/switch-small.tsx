import { Switch as TailwindSwitch } from "@headlessui/react";
import classNames from "@/src/client-functions/client-utils";

export default function SmallSwitch({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <TailwindSwitch
      checked={checked}
      onChange={onChange}
      className={classNames(
        checked ? "bg-primary" : "bg-secondary",
        "relative inline-flex h-4 w-8 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:border-primary focus:outline-none focus:ring-0",
      )}
    >
      <span className="sr-only">Switch</span>
      <span
        aria-hidden="true"
        className={classNames(
          checked ? "translate-x-4" : "translate-x-0",
          "pointer-events-none inline-block h-3 w-3 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
        )}
      />
    </TailwindSwitch>
  );
}
