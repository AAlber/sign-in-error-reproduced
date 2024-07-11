import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import { xcodeLight } from "@uiw/codemirror-theme-xcode";
import ReactCodeMirror, {
  type ReactCodeMirrorRef,
} from "@uiw/react-codemirror";
import clsx from "clsx";
import { TrashIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import type { SlateCode } from "@/src/components/slate";
import { renderLanguage } from "@/src/components/slate/toolbar/code-button";

interface Props extends Partial<SlateCode> {
  minHeightExpanded?: string;
  minHeightCollapsed?: string;
  isMyMessage?: boolean;
}

const CodeMessage = (props: Props) => {
  const {
    codeMessage,
    setCodeMessage,
    minHeightExpanded = "min-h-[240px]",
    minHeightCollapsed = "min-h-[64px]",
    isMyMessage = true,
  } = props;
  const [isCollapsed, setIsCollapsed] = useState(true);
  const { resolvedTheme } = useTheme();
  const { t } = useTranslation("page");

  const isDark = resolvedTheme === "dark";

  const codeViewerRef = useRef<ReactCodeMirrorRef>(null);

  if (!codeMessage) return null;
  return (
    <div
      className="relative mb-2 flex flex-col space-y-2 rounded-sm  border-border"
      onWheel={(e) => {
        e.stopPropagation();
      }}
    >
      {!!setCodeMessage && (
        <div className="flex justify-end text-xs">
          <button
            className={clsx(
              "flex items-center space-x-2 text-muted-contrast",
              isMyMessage ? "text-contrast" : "",
            )}
            onClick={() => {
              setCodeMessage(undefined);
            }}
          >
            <TrashIcon size={12} />
            <span>Clear</span>
          </button>
        </div>
      )}
      <div
        className={clsx(
          "relative flex overflow-scroll rounded-md",
          isCollapsed ? minHeightCollapsed : minHeightExpanded,
        )}
      >
        <ReactCodeMirror
          readOnly
          ref={codeViewerRef}
          theme={isDark ? vscodeDark : xcodeLight}
          extensions={[renderLanguage(codeMessage.language)]}
          editable={false}
          className={clsx("absolute w-full")}
          value={codeMessage.code}
        />
      </div>
      <div className="flex">
        <button
          className={clsx(
            "text-left text-[10px]",
            isMyMessage ? "text-white" : "",
          )}
          onClick={() => {
            setIsCollapsed(!isCollapsed);
          }}
        >
          {isCollapsed
            ? `+ ${t("chat.toolbar.code.expand")}`
            : `- ${t("chat.toolbar.code.collapse")}`}
        </button>
      </div>
    </div>
  );
};

export default CodeMessage;
