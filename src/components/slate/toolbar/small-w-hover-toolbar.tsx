import { t } from "i18next";
import { EllipsisVertical } from "lucide-react";
import React from "react";
import GiphyButton from "@/src/components/reusable/page-layout/navigator/chat/text-input/giphy";
import { Button } from "@/src/components/reusable/shadcn-ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/src/components/reusable/shadcn-ui/popover";
import type { WithToolTipProps } from "@/src/components/reusable/with-tooltip";
import WithToolTip from "@/src/components/reusable/with-tooltip";
import { BlockButton, MarkButton } from "../components";
import CodeButton from "./code-button";
import InsertLink from "./insert-link";
import { ToolbarDivider } from "./toolbar-divider";

type Props = {
  isChatMode: boolean;
  isEditing: boolean;
  isSearching: boolean;
  toolbarWidth: number;
};

export function SmallWidthHoverToolbar({
  isChatMode,
  isEditing,
  isSearching,
  toolbarWidth,
}: Props) {
  if (toolbarWidth > 460) return null;
  return (
    <Popover>
      <ToolbarDivider />
      <PopoverTrigger asChild>
        <Button variant="ghost" className="relative left-[-3px]">
          <EllipsisVertical className="size-4 text-muted-contrast" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="flex items-center justify-between !p-1"
        style={{ maxWidth: toolbarWidth <= 400 ? 400 : 120 }}
        align="end"
      >
        {toolbarWidth < 400 && (
          <>
            <WithToolTip_ text={t("chat.toolbar.strikethrough")}>
              <MarkButton format="strikethrough" />
            </WithToolTip_>

            <WithToolTip_ text={t("chat.toolbar.block_quote")}>
              <BlockButton format="block-quote" />
            </WithToolTip_>

            <WithToolTip_ text={t("chat.toolbar.numbered_list")}>
              <BlockButton format="numbered-list" />
            </WithToolTip_>

            <WithToolTip_ text={t("chat.toolbar.bulleted_list")}>
              <BlockButton format="bulleted-list" />
            </WithToolTip_>

            <ToolbarDivider />
          </>
        )}

        {toolbarWidth < 460 && (
          <>
            <WithToolTip_
              text={t("chat.toolbar.insert_link")}
              className="-ml-1"
              disabled
            >
              <InsertLink />
            </WithToolTip_>
            {isChatMode && !isEditing && (
              <WithToolTip_ text={t("chat.toolbar.insert_code")}>
                <CodeButton />
              </WithToolTip_>
            )}
            {!isSearching && (
              <WithToolTip_ text="GIF">
                <GiphyButton />
              </WithToolTip_>
            )}
          </>
        )}
      </PopoverContent>
    </Popover>
  );
}

function WithToolTip_({
  children,
  text,
  className,
  ...props
}: React.PropsWithChildren<WithToolTipProps>) {
  return (
    <WithToolTip
      text={text}
      side="top"
      delay={300}
      className={className}
      {...props}
    >
      {children}
    </WithToolTip>
  );
}
