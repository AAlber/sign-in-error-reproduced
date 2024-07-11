import { useTheme } from "next-themes";
import React from "react";
import { useTranslation } from "react-i18next";
import classNames from "@/src/client-functions/client-utils";
import Spinner from "../spinner";

type ButtonProps = {
  title?: string;
  enabled?: boolean;
  onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  loading?: boolean;
  icon?: JSX.Element;
  palette?: "default" | "blue" | "green" | "red" | "yellow";
  fullwidth?: boolean;
  shine?: boolean;
};

const colorPalette = {
  defaultActive: "bg-foreground text-contrast border-border hover:opacity-80",
  defaultDisabled: "border-border bg-foreground text-muted-contrast",
  blue: "bg-primary/40 border-primary text-contrast hover:bg-primary/30 ",
  green:
    "bg-emerald-100 dark:bg-emerald-900 border-emerald-300 dark:border-emerald-600 text-contrast dark:hover:bg-emerald-800 hover:bg-emerald-200",
  red: "bg-destructive/40 border-destructive text-contrast hover:bg-destructive/30",
  yellow:
    "bg-yellow-100 dark:bg-yellow-900 border-yellow-300 dark:border-yellow-600 text-contrast dark:hover:bg-yellow-800 hover:bg-yellow-200",
};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      title = "",
      enabled = true,
      onClick = () => {
        console.log("Button clicked");
      },
      loading = false,
      icon = <></>,
      palette = "default",
      shine = false,
      fullwidth = false,
    },
    ref,
  ) => {
    const { t } = useTranslation("page");
    const { resolvedTheme } = useTheme();
    const isDark = resolvedTheme === "dark";

    return (
      <button
        ref={ref}
        data-testid="normal-button"
        type={"button"}
        aria-label={t(title)}
        disabled={!enabled}
        onClick={(e) => {
          // e.preventDefault();
          if (enabled && !loading) onClick(e);
        }}
        className={classNames(
          `${
            enabled
              ? `relative flex items-center justify-center transition-colors duration-200 ${
                  palette === "default"
                    ? colorPalette.defaultActive
                    : palette === "blue"
                    ? colorPalette.blue
                    : palette === "green"
                    ? colorPalette.green
                    : palette === "yellow"
                    ? colorPalette.yellow
                    : colorPalette.red
                }`
              : `cursor-not-allowed border-border bg-foreground text-muted-contrast  ${colorPalette.defaultDisabled}`
          } flex h-8 ${
            fullwidth && "w-full"
          } items-center justify-center gap-2 rounded-md border px-2.5 py-1 text-base font-medium shadow-sm focus:outline-none  sm:text-sm`,
        )}
      >
        {shine && isDark ? (
          <span className="btn-shine">{t(title)}</span>
        ) : t(title) && loading ? (
          t("general.loading").replaceAll("...", "")
        ) : (
          t(title)
        )}
        {!loading && icon}
        {loading && <Spinner />}
      </button>
    );
  },
);

Button.displayName = "New Button";
export default Button;
