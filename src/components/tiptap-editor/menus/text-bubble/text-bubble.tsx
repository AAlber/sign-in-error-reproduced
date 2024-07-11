import { BubbleMenu as TipTapBubbleMenu } from "@tiptap/react";
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Bold,
  Code,
  Code2,
  Highlighter,
  Italic,
  Link,
  MoreVertical,
  Palette,
  Strikethrough,
  Subscript,
  Superscript,
  Underline,
} from "lucide-react";
import { memo } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/src/components/reusable/shadcn-ui/popover";
import { useTextCommands, useTextStates } from "../../hooks";
import SelectionMenu from "../../selection-menu";
import { LinkEditor } from "../link/components";
import type { MenuProps, TextBubbleSubMenuProps } from "../types";
import { AIDropdown, ColorPicker, FontSizePicker } from "./components";

const MemoizedColorPicker = memo(ColorPicker);
const MemoizedFontSizePicker = memo(FontSizePicker);

export const TextBubbleMenu = ({
  editor,
  tippyOptions,
  subMenu,
}: MenuProps & TextBubbleSubMenuProps) => {
  const textCommmands = useTextCommands(editor);
  const textStates = useTextStates(editor);

  return (
    <TipTapBubbleMenu
      pluginKey="textMenu"
      editor={editor}
      tippyOptions={tippyOptions}
      shouldShow={textStates.shouldShow}
    >
      <SelectionMenu>
        {(subMenu?.ai?.enabled ?? true) && (
          <SelectionMenu.Section>
            <AIDropdown editor={editor} />
          </SelectionMenu.Section>
        )}

        {(subMenu?.fontSizes?.enabled ?? true) && (
          <SelectionMenu.Section>
            <MemoizedFontSizePicker
              currentValue={textStates.currentSize || ""}
              onChange={textCommmands.onSetFontSize}
            />
          </SelectionMenu.Section>
        )}
        <SelectionMenu.Section>
          {(subMenu?.bold?.enabled ?? true) && (
            <SelectionMenu.IconButton
              icon={<Bold className="h-4 w-4" />}
              active={textStates.isBold}
              onClick={textCommmands.onBold}
            />
          )}
          {(subMenu?.italic?.enabled ?? true) && (
            <SelectionMenu.IconButton
              icon={<Italic className="h-4 w-4" />}
              active={textStates.isItalic}
              onClick={textCommmands.onItalic}
            />
          )}
          {(subMenu?.underline?.enabled ?? true) && (
            <SelectionMenu.IconButton
              icon={<Underline className="h-4 w-4" />}
              active={textStates.isUnderline}
              onClick={textCommmands.onUnderline}
            />
          )}
          {(subMenu?.strikethrough?.enabled ?? true) && (
            <SelectionMenu.IconButton
              icon={<Strikethrough className="h-4 w-4" />}
              active={textStates.isStrike}
              onClick={textCommmands.onStrikeThrough}
            />
          )}
          {(subMenu?.code?.enabled ?? true) && (
            <SelectionMenu.IconButton
              icon={<Code className="h-4 w-4" />}
              active={textStates.isCode}
              onClick={textCommmands.onCode}
            />
          )}
          {(subMenu?.codeBlock?.enabled ?? true) && (
            <SelectionMenu.IconButton
              icon={<Code2 className="h-4 w-4" />}
              onClick={textCommmands.onCodeBlock}
            />
          )}
          {(subMenu?.link?.enabled ?? true) && (
            <Popover>
              <PopoverTrigger>
                <SelectionMenu.IconButton icon={<Link className="h-4 w-4" />} />
              </PopoverTrigger>
              <PopoverContent className="flex w-80 flex-col gap-y-2">
                <LinkEditor onSetLink={textCommmands.onLink} />
              </PopoverContent>
            </Popover>
          )}
          {(subMenu?.highlightColors?.enabled ?? true) && (
            <Popover>
              <PopoverTrigger>
                <SelectionMenu.IconButton
                  active={!!textStates.currentHighlight}
                  icon={<Highlighter className="h-4 w-4" />}
                />
              </PopoverTrigger>
              <PopoverContent className="w-max">
                <MemoizedColorPicker
                  currentColor={textStates.currentHighlight}
                  onColorChange={textCommmands.onChangeHighlight}
                  onClearColor={textCommmands.onClearHighlight}
                />
              </PopoverContent>
            </Popover>
          )}
          {(subMenu?.fontColors?.enabled ?? true) && (
            <Popover>
              <PopoverTrigger>
                <SelectionMenu.IconButton
                  active={!!textStates.currentColor}
                  icon={<Palette className="h-4 w-4" />}
                />
              </PopoverTrigger>
              <PopoverContent className="w-max">
                <MemoizedColorPicker
                  currentColor={textStates.currentColor}
                  onColorChange={textCommmands.onChangeColor}
                  onClearColor={textCommmands.onClearColor}
                />
              </PopoverContent>
            </Popover>
          )}
          <Popover>
            <PopoverTrigger>
              <SelectionMenu.IconButton
                icon={<MoreVertical className="h-4 w-4" />}
              />
            </PopoverTrigger>
            <PopoverContent className="w-max border-none p-0">
              <SelectionMenu>
                <SelectionMenu.Section>
                  {(subMenu?.subscript?.enabled ?? true) && (
                    <SelectionMenu.IconButton
                      active={textStates.isSubscript}
                      icon={<Subscript className="h-4 w-4" />}
                      onClick={textCommmands.onSubscript}
                    />
                  )}
                  {(subMenu?.superscript?.enabled ?? true) && (
                    <SelectionMenu.IconButton
                      active={textStates.isSuperscript}
                      icon={<Superscript className="h-4 w-4" />}
                      onClick={textCommmands.onSuperscript}
                    />
                  )}
                </SelectionMenu.Section>
                <SelectionMenu.Section>
                  {(subMenu?.alignLeft?.enabled ?? true) && (
                    <SelectionMenu.IconButton
                      active={textStates.isAlignLeft}
                      icon={<AlignLeft className="h-4 w-4" />}
                      onClick={textCommmands.onAlignLeft}
                    />
                  )}
                  {(subMenu?.alignCenter?.enabled ?? true) && (
                    <SelectionMenu.IconButton
                      active={textStates.isAlignCenter}
                      icon={<AlignCenter className="h-4 w-4" />}
                      onClick={textCommmands.onAlignCenter}
                    />
                  )}
                  {(subMenu?.alignRight?.enabled ?? true) && (
                    <SelectionMenu.IconButton
                      active={textStates.isAlignRight}
                      icon={<AlignRight className="h-4 w-4" />}
                      onClick={textCommmands.onAlignRight}
                    />
                  )}
                  {(subMenu?.alignJustify?.enabled ?? true) && (
                    <SelectionMenu.IconButton
                      active={textStates.isAlignJustify}
                      icon={<AlignJustify className="h-4 w-4" />}
                      onClick={textCommmands.onAlignJustify}
                    />
                  )}
                </SelectionMenu.Section>
              </SelectionMenu>
            </PopoverContent>
          </Popover>
        </SelectionMenu.Section>
      </SelectionMenu>
    </TipTapBubbleMenu>
  );
};
