import { useTheme } from "next-themes";

export default function Loader({
  size = 25,
  fill = "fill-fuxam-pink",
  fullscreen = false,
  spinner = false,
  width = 45,
  height = 45,
}) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  return spinner ? (
    <div
      className={`${
        fullscreen &&
        "absolute left-0 top-0 flex h-screen w-screen items-center justify-center bg-background pl-7 opacity-75"
      }`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={`${width}px`}
        height={`${height}px`}
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid"
      >
        <circle
          cx="50"
          cy="50"
          fill="none"
          stroke={isDark ? "#F1F1F1" : "#313131"}
          strokeWidth="9"
          r="31"
          strokeDasharray="146.08405839192537 50.69468613064179"
        >
          <animateTransform
            attributeName="transform"
            type="rotate"
            repeatCount="indefinite"
            dur="0.7"
            values="0 50 50;360 50 50"
            keyTimes="0;1"
          ></animateTransform>
        </circle>
      </svg>
    </div>
  ) : (
    <div
      className={`${
        fullscreen &&
        "absolute left-0 top-0 flex h-screen w-screen items-center justify-center bg-background pl-7"
      }`}
    >
      <svg
        version="1.1"
        id="Loader"
        xmlns="http://www.w3.org/2000/svg"
        x="0px"
        y="0px"
        viewBox="0 0 100 100"
        enableBackground="new 0 0 0 0"
        width={size}
        height={size}
        className={fill}
      >
        <circle className={fill} stroke="none" cx="6" cy="50" r="6">
          <animate
            attributeName="opacity"
            dur="1.5s"
            values="0;1;0"
            repeatCount="indefinite"
            begin="0.1"
          />
        </circle>
        <circle className={fill} stroke="none" cx="26" cy="50" r="6">
          <animate
            attributeName="opacity"
            dur="1.5s"
            values="0;1;0"
            repeatCount="indefinite"
            begin="0.2"
          />
        </circle>
        <circle className={fill} stroke="none" cx="46" cy="50" r="6">
          <animate
            attributeName="opacity"
            dur="1.5s"
            values="0;1;0"
            repeatCount="indefinite"
            begin="0.3"
          />
        </circle>
      </svg>
    </div>
  );
}
