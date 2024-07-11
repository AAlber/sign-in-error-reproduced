import { useTheme } from "next-themes";
import React from "react";
import { useTranslation } from "react-i18next";
import classNames from "@/src/client-functions/client-utils";

const badgePalette = {
  blue: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100 dark:border-blue-600 border-blue-300",
  green:
    "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-100 dark:border-emerald-600 border-emerald-300",
  red: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 border-red-300 dark:border-red-600",
  yellow:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 border-yellow-300 dark:border-yellow-600",
  gray: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300 border-gray-300 dark:border-gray-600",
};

type Props = {
  title?: string;
  color?: BadgeColors;
  shine?: boolean;
} & React.ComponentPropsWithRef<"div">;

export type BadgeColors = "blue" | "green" | "red" | "yellow" | "gray";

const Badge = React.forwardRef<HTMLDivElement, Props>(
  ({ title, color, shine = false, className, ...props }, ref) => {
    const { t } = useTranslation("page");
    const { resolvedTheme } = useTheme();
    const isDark = resolvedTheme === "dark";
    return (
      <div
        ref={ref}
        className={classNames(
          "ml-1 flex items-center rounded-xl border px-1.5 text-xs",
          shine && isDark && "btn-shine",
          color === "blue"
            ? badgePalette.blue
            : color === "green"
            ? badgePalette.green
            : color === "red"
            ? badgePalette.red
            : color === "gray"
            ? badgePalette.gray
            : badgePalette.yellow,
          className,
        )}
        {...props}
      >
        {t(title ?? "")}
      </div>
    );
  },
);

Badge.displayName = "Badge";
export default Badge;
