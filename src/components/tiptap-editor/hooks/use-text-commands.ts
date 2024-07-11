import type { Editor } from "@tiptap/react";
import type { Language, Tone } from "@tiptap-pro/extension-ai";
import { useCallback } from "react";

export const useTextCommands = (editor: Editor) => {
  const onBold = useCallback(
    () => editor.chain().focus().toggleBold().run(),
    [editor],
  );
  const onItalic = useCallback(
    () => editor.chain().focus().toggleItalic().run(),
    [editor],
  );
  const onUnderline = useCallback(
    () => editor.chain().focus().toggleUnderline().run(),
    [editor],
  );
  const onStrikeThrough = useCallback(
    () => editor.chain().focus().toggleStrike().run(),
    [editor],
  );
  const onCode = useCallback(
    () => editor.chain().focus().toggleCode().run(),
    [editor],
  );
  const onCodeBlock = useCallback(
    () => editor.chain().focus().toggleCodeBlock().run(),
    [editor],
  );

  const onSubscript = useCallback(
    () => editor.chain().focus().toggleSubscript().run(),
    [editor],
  );
  const onSuperscript = useCallback(
    () => editor.chain().focus().toggleSuperscript().run(),
    [editor],
  );
  const onAlignLeft = useCallback(
    () => editor.chain().focus().setTextAlign("left").run(),
    [editor],
  );
  const onAlignCenter = useCallback(
    () => editor.chain().focus().setTextAlign("center").run(),
    [editor],
  );
  const onAlignRight = useCallback(
    () => editor.chain().focus().setTextAlign("right").run(),
    [editor],
  );
  const onAlignJustify = useCallback(
    () => editor.chain().focus().setTextAlign("justify").run(),
    [editor],
  );

  const onSimplify = useCallback(
    () => editor.chain().focus().aiSimplify({ stream: true }).run(),
    [editor],
  );
  const onEmojify = useCallback(
    () => editor.chain().focus().aiEmojify({ stream: true }).run(),
    [editor],
  );
  const onCompleteSentence = useCallback(
    () => editor.chain().focus().aiComplete({ stream: true }).run(),
    [editor],
  );
  const onFixSpelling = useCallback(
    () =>
      editor.chain().focus().aiFixSpellingAndGrammar({ stream: true }).run(),
    [editor],
  );
  const onMakeLonger = useCallback(
    () => editor.chain().focus().aiExtend({ stream: true }).run(),
    [editor],
  );
  const onMakeShorter = useCallback(
    () => editor.chain().focus().aiShorten({ stream: true }).run(),
    [editor],
  );
  const onTldr = useCallback(
    () => editor.chain().focus().aiTldr({ stream: true }).run(),
    [editor],
  );
  const onTone = useCallback(
    (tone: Tone) =>
      editor.chain().focus().aiAdjustTone(tone, { stream: true }).run(),
    [editor],
  );
  const onTranslate = useCallback(
    (language: Language) =>
      editor.chain().focus().aiTranslate(language, { stream: true }).run(),
    [editor],
  );

  const onLink = useCallback(
    (url: string, openInNewTab: boolean) =>
      editor
        .chain()
        .focus()
        .setLink({ href: url, target: openInNewTab ? "_blank" : "" })
        .run(),
    [editor],
  );

  const onChangeColor = useCallback(
    (color: string) => editor.chain().setColor(color).run(),
    [editor],
  );
  const onClearColor = useCallback(
    () => editor.chain().focus().unsetColor().run(),
    [editor],
  );

  const onChangeHighlight = useCallback(
    (color: string) => editor.chain().setHighlight({ color }).run(),
    [editor],
  );
  const onClearHighlight = useCallback(
    () => editor.chain().focus().unsetHighlight().run(),
    [editor],
  );

  const onSetFontSize = useCallback(
    (fontSize: string) => {
      if (!fontSize || fontSize.length === 0) {
        return editor.chain().focus().unsetFontSize().run();
      }
      return editor.chain().focus().setFontSize(fontSize).run();
    },
    [editor],
  );

  return {
    onBold,
    onItalic,
    onUnderline,
    onStrikeThrough,
    onCode,
    onCodeBlock,
    onSubscript,
    onSuperscript,
    onAlignLeft,
    onAlignCenter,
    onAlignRight,
    onAlignJustify,
    onSimplify,
    onEmojify,
    onCompleteSentence,
    onFixSpelling,
    onMakeLonger,
    onMakeShorter,
    onTldr,
    onTone,
    onTranslate,
    onLink,
    onChangeColor,
    onClearColor,
    onChangeHighlight,
    onClearHighlight,
    onSetFontSize,
  };
};
