import clsx from "clsx";
import React, { type HTMLAttributes, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import GiphyButton from "@/src/components/reusable/page-layout/navigator/chat/text-input/giphy";
import Options from "@/src/components/reusable/page-layout/navigator/chat/text-input/options";
import useChat from "@/src/components/reusable/page-layout/navigator/chat/zustand";
import WithToolTip from "@/src/components/reusable/with-tooltip";
import { BlockButton, MarkButton } from "../components";
import { useCustomSlateContext } from "../provider";
import CodeButton from "./code-button";
import InsertLink from "./insert-link";
import MoreOptions from "./more-options";
import { SmallWidthHoverToolbar } from "./small-w-hover-toolbar";
import { ToolbarDivider } from "./toolbar-divider";

type Props = { isHoveringToolbar?: boolean } & HTMLAttributes<HTMLDivElement>;

export const SlateToolbar = React.forwardRef<HTMLDivElement, Props>(
  ({ isHoveringToolbar = false, className, ...rest }, ref) => {
    const { isEditing, isChatMode } = useCustomSlateContext();
    const { t } = useTranslation("page");
    const [toolbarWidth, setToolbarWidth] = useState(0);
    const toolbarRef = useRef<HTMLDivElement>(null);

    const { isSearching } = useChat();

    useEffect(() => {
      const toolbarElement = toolbarRef.current;
      if (toolbarElement) {
        const resizeObserver = new ResizeObserver((entries) => {
          for (const entry of entries) {
            const { width } = entry.contentRect;
            setToolbarWidth(Math.ceil(width));
          }
        });

        resizeObserver.observe(toolbarElement);

        return () => {
          if (toolbarElement) {
            resizeObserver.unobserve(toolbarElement);
          }
        };
      }
    }, []);

    return (
      <div
        className={clsx(
          "mx-auto mt-2 flex w-full max-w-[1336px] items-center justify-between",
          className,
        )}
        ref={toolbarRef}
        {...rest}
      >
        <div className="flex grow items-center space-x-2 overflow-x-scroll">
          {isChatMode && !isEditing && <MoreOptions />}

          <WithToolTip text={t("chat.toolbar.bold")}>
            <MarkButton format="bold" />
          </WithToolTip>

          <WithToolTip text={t("chat.toolbar.italic")}>
            <MarkButton format="italic" />
          </WithToolTip>

          <WithToolTip text={t("chat.toolbar.underline")}>
            <MarkButton format="underline" />
          </WithToolTip>

          {toolbarWidth > 400 && (
            <>
              <WithToolTip text={t("chat.toolbar.strikethrough")}>
                <MarkButton format="strikethrough" />
              </WithToolTip>

              <ToolbarDivider />

              <WithToolTip text={t("chat.toolbar.block_quote")}>
                <BlockButton format="block-quote" />
              </WithToolTip>

              <WithToolTip text={t("chat.toolbar.numbered_list")}>
                <BlockButton format="numbered-list" />
              </WithToolTip>

              <WithToolTip text={t("chat.toolbar.bulleted_list")}>
                <BlockButton format="bulleted-list" />
              </WithToolTip>
            </>
          )}

          {toolbarWidth > 460 && (
            <>
              <ToolbarDivider />
              {!isHoveringToolbar && (
                <WithToolTip text={t("chat.toolbar.insert_link")}>
                  <InsertLink />
                </WithToolTip>
              )}

              {isChatMode && !isEditing && (
                <WithToolTip text={t("chat.toolbar.insert_code")}>
                  <CodeButton />
                </WithToolTip>
              )}

              {!isSearching && (
                <WithToolTip text="GIF">
                  <GiphyButton />
                </WithToolTip>
              )}
            </>
          )}

          <SmallWidthHoverToolbar
            toolbarWidth={toolbarWidth}
            isChatMode={!!isChatMode}
            isEditing={!!isEditing}
            isSearching={isSearching}
          />
        </div>
        {isChatMode && !isEditing && <Options />}
      </div>
    );
  },
);

SlateToolbar.displayName = "Slate Toolbar";
