import { useTheme } from "next-themes";
import ContentLoader from "react-content-loader";
import { getCurrentTheme } from "../client-functions/client-institution-theme";
import useThemeStore from "./dashboard/navigation/primary-sidebar/user-menu/theme-switcher/zustand";

type SkeletonProps = {
  specialColor?: string;
};

export default function Skeleton({ specialColor }: SkeletonProps) {
  const { instiTheme } = useThemeStore();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <ContentLoader
      backgroundColor={
        specialColor || isDark
          ? `hsl(${getCurrentTheme(instiTheme)!.cssVars.dark.background})`
          : `hsl(${getCurrentTheme(instiTheme)!.cssVars.light.background})`
      }
      foregroundColor={
        specialColor || isDark
          ? `hsl(${getCurrentTheme(instiTheme)!.cssVars.dark.accent})`
          : `hsl(${getCurrentTheme(instiTheme)!.cssVars.light.accent})`
      }
      className="!h-full !w-full"
    >
      <rect className="!h-screen !w-full" />
    </ContentLoader>
  );
}
