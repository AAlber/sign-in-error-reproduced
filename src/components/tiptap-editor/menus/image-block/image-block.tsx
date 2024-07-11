import { BubbleMenu as TipTapBubbleMenu } from "@tiptap/react";
import {
  AlignHorizontalDistributeCenter,
  AlignHorizontalDistributeEnd,
  AlignHorizontalDistributeStart,
} from "lucide-react";
import React, { useCallback, useRef } from "react";
import type { Instance } from "tippy.js";
import { sticky } from "tippy.js";
import { v4 as uuid } from "uuid";
import { getRenderContainer } from "@/src/client-functions/client-editor";
import SelectionMenu from "../../selection-menu";
import type { MenuProps } from "../types";
import { ImageBlockWidth } from "./components/image-block-width";

export const ImageBlockMenu = ({
  editor,
  tippyOptions,
}: MenuProps): JSX.Element => {
  const tippyInstance = useRef<Instance | null>(null);

  const getReferenceClientRect = useCallback(() => {
    const renderContainer = getRenderContainer(editor, "node-imageBlock");
    const rect =
      renderContainer?.getBoundingClientRect() ||
      new DOMRect(-1000, -1000, 0, 0);

    return rect;
  }, [editor]);

  const shouldShow = useCallback(() => {
    const isActive = editor.isActive("imageBlock");

    return isActive;
  }, [editor]);

  const onAlignImageLeft = useCallback(() => {
    editor
      .chain()
      .focus(undefined, { scrollIntoView: false })
      .setImageBlockAlign("left")
      .run();
  }, [editor]);

  const onAlignImageCenter = useCallback(() => {
    editor
      .chain()
      .focus(undefined, { scrollIntoView: false })
      .setImageBlockAlign("center")
      .run();
  }, [editor]);

  const onAlignImageRight = useCallback(() => {
    editor
      .chain()
      .focus(undefined, { scrollIntoView: false })
      .setImageBlockAlign("right")
      .run();
  }, [editor]);

  const onWidthChange = useCallback(
    (value: number) => {
      editor
        .chain()
        .focus(undefined, { scrollIntoView: false })
        .setImageBlockWidth(value)
        .run();
    },
    [editor],
  );

  return (
    <TipTapBubbleMenu
      editor={editor}
      pluginKey={`imageBlockMenu-${uuid()}`}
      shouldShow={shouldShow}
      updateDelay={0}
      tippyOptions={{
        offset: [0, 8],
        popperOptions: {
          modifiers: [{ name: "flip", enabled: false }],
        },
        getReferenceClientRect,
        onCreate: (instance: Instance) => {
          tippyInstance.current = instance;
        },
        plugins: [sticky],
        sticky: "popper",
        ...tippyOptions,
      }}
    >
      <SelectionMenu>
        <SelectionMenu.Section>
          <SelectionMenu.IconButton
            icon={<AlignHorizontalDistributeStart className="h-4 w-4" />}
            active={editor.isActive("imageBlock", { align: "left" })}
            onClick={onAlignImageLeft}
          />
          <SelectionMenu.IconButton
            icon={<AlignHorizontalDistributeCenter className="h-4 w-4" />}
            active={editor.isActive("imageBlock", { align: "center" })}
            onClick={onAlignImageCenter}
          />
          <SelectionMenu.IconButton
            icon={<AlignHorizontalDistributeEnd className="h-4 w-4" />}
            active={editor.isActive("imageBlock", { align: "right" })}
            onClick={onAlignImageRight}
          />
        </SelectionMenu.Section>
        <SelectionMenu.Section>
          <ImageBlockWidth
            onChange={onWidthChange}
            value={parseInt(editor.getAttributes("imageBlock").width)}
          />
        </SelectionMenu.Section>
      </SelectionMenu>
    </TipTapBubbleMenu>
  );
};
