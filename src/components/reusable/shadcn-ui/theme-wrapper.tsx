"use client";

import { cx } from "class-variance-authority";

interface ThemeWrapperProps extends React.ComponentProps<"body"> {
  defaultTheme?: string;
}

export function ThemeWrapper({ children, className }: ThemeWrapperProps) {
  return (
    <body className={cx(`main-div bg-background`, className)}>{children}</body>
  );
}
