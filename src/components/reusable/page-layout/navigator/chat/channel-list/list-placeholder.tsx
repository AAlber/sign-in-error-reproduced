import { useTheme } from "next-themes";
import ContentLoader from "react-content-loader";
import { getCurrentTheme } from "@/src/client-functions/client-institution-theme";
import useThemeStore from "../../../../../dashboard/navigation/primary-sidebar/user-menu/theme-switcher/zustand";

const Placeholder: React.FC<{ iterations?: number }> = (props) => {
  const { instiTheme } = useThemeStore();
  const iterations = props.iterations ?? 1;
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const backgroundColor = isDark
    ? `hsl(${getCurrentTheme(instiTheme)?.cssVars.dark.background})`
    : `hsl(${getCurrentTheme(instiTheme)?.cssVars.light.background})`; // bg-background
  const contrastColor = isDark
    ? `hsl(${getCurrentTheme(instiTheme)?.cssVars.dark.accent})`
    : `hsl(${getCurrentTheme(instiTheme)?.cssVars.light.accent})`; // bg-accent

  return (
    <div className="space-y-6 pt-2">
      <ContentLoader
        height={24}
        speed={1}
        backgroundColor={backgroundColor}
        foregroundColor={contrastColor}
        viewBox="0 0 380 30"
      >
        <rect x={0} y={8} width={randomBetween(140, 280)} height={22} rx={8} />
      </ContentLoader>
      <div className="space-y-3">
        {new Array(iterations).fill(undefined).map((_, idx) => {
          return (
            <div key={idx}>
              <ContentLoader
                height={40}
                speed={1}
                backgroundColor={backgroundColor}
                foregroundColor={contrastColor}
                viewBox="0 0 380 30"
              >
                <rect x={0} y={0} rx={100} ry={100} width={24} height={24} />
                <rect
                  x={30}
                  y={1}
                  rx={4}
                  ry={4}
                  width={randomBetween(70, 120)}
                  height={8}
                />
                <rect
                  x={30}
                  y={16}
                  rx={3}
                  ry={3}
                  width={randomBetween(50, 80)}
                  height={6}
                />
              </ContentLoader>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const ChannelListPlaceholder = ({
  iterations = 6,
}: {
  iterations?: number;
}) => (
  <div className="h-full bg-foreground">
    <Placeholder iterations={iterations} />
  </div>
);

export default ChannelListPlaceholder;

function randomBetween(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
