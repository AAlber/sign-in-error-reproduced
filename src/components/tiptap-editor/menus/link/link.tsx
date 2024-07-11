import { BubbleMenu as TiptapBubbleMenu } from "@tiptap/react";
import { Link, Trash } from "lucide-react";
import React, { useCallback } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../../reusable/shadcn-ui/popover";
import { useTextCommands } from "../../hooks";
import SelectionMenu from "../../selection-menu";
import type { MenuProps } from "../types";
import { LinkEditor } from "./components";

export const LinkMenu = ({ editor, tippyOptions }: MenuProps): JSX.Element => {
  const textCommands = useTextCommands(editor);

  const shouldShow = useCallback(() => {
    const isActive = editor.isActive("link");
    return isActive;
  }, [editor]);

  const { href: link, target } = editor.getAttributes("link");

  const onUnsetLink = useCallback(() => {
    editor.chain().focus().extendMarkRange("link").unsetLink().run();
  }, [editor]);

  return (
    <TiptapBubbleMenu
      editor={editor}
      pluginKey="textMenu"
      shouldShow={shouldShow}
      updateDelay={0}
      tippyOptions={{
        popperOptions: {
          modifiers: [{ name: "flip", enabled: false }],
        },
        ...tippyOptions,
      }}
    >
      <SelectionMenu>
        <SelectionMenu.Section>
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm underline"
          >
            {link}
          </a>
        </SelectionMenu.Section>
        <SelectionMenu.Section>
          <Popover>
            <PopoverTrigger>
              <SelectionMenu.IconButton icon={<Link className="h-4 w-4" />} />
            </PopoverTrigger>
            <PopoverContent className="flex w-80 flex-col gap-y-2">
              <LinkEditor
                initial={{ url: link, openInNewTab: target === "_blank" }}
                onSetLink={textCommands.onLink}
              />
            </PopoverContent>
          </Popover>
          <SelectionMenu.IconButton
            icon={<Trash className="h-4 w-4" />}
            onClick={onUnsetLink}
          />
        </SelectionMenu.Section>
      </SelectionMenu>
    </TiptapBubbleMenu>
  );
};

export default LinkMenu;
