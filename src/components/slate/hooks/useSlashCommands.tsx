import { useCallback } from "react";
import type { Editor } from "slate";
import { AVAILABLE_COMMANDS } from "../commands-popup";
import type { SetTargetType, TargetType } from "../types";
import { getWordBefore } from "../utils";

const useSlashCommand = (args: {
  enabled: boolean;
  editor: Editor;
  target: TargetType;
  setTarget: SetTargetType;
}) => {
  const { editor, enabled, target, setTarget } = args;

  const listenCommands = useCallback(() => {
    try {
      if (!enabled) throw "";
      const wordBefore = getWordBefore(editor);

      if (!wordBefore) throw "";
      const { range, word } = wordBefore;

      /**
       * Only pass if the first word in input is a
       * slash-command or `/giphy`
       */
      if (!word || !range || range.anchor.offset) throw "";

      const stripped = word.replace("/", "");
      const hasMatch = AVAILABLE_COMMANDS.some(
        (i) => !!stripped && i.command.startsWith(stripped),
      );

      if (!hasMatch) throw "";

      setTarget(range);
    } catch (e) {
      if (!target) return;
      setTarget(null);
    }
  }, [enabled, target]);

  return { listenCommands };
};

export default useSlashCommand;
