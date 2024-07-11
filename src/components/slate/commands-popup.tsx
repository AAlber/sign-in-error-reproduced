import clsx from "clsx";
import { useEffect, useState } from "react";
import type { Editor } from "slate";
import { Transforms } from "slate";
import { ReactEditor } from "slate-react";
import type { SetTargetType, TargetType } from "./types";
import { getWordBefore } from "./utils";

interface CommandsPopupProps {
  target: TargetType;
  setTarget: SetTargetType;
  editor: Editor;
}

export const AVAILABLE_COMMANDS = [
  { command: "giphy", label: "Post a random GIF" },
];

const CommandsPopup: React.FC<CommandsPopupProps> = (props) => {
  const [isSelected, setSelected] = useState(false);
  const { editor, target, setTarget } = props;

  useEffect(() => {
    const selectAndBlurEditor = () => {
      setSelected(true);
      ReactEditor.blur(editor);
    };

    const handleNavigateCommands = (e: KeyboardEvent) => {
      /**
       * TODO: Update as we add more commands
       * Simulates
       */
      if (!AVAILABLE_COMMANDS[0]) return;
      const ACCEPTED_KEYS = ["Enter", "Tab", "ArrowUp", "ArrowDown"];

      if (ACCEPTED_KEYS.includes(e.key)) {
        e.preventDefault();

        switch (e.key) {
          case "Tab": {
            if (isSelected) {
              handleClick(AVAILABLE_COMMANDS[0].command)();
            } else {
              selectAndBlurEditor();
            }
            return;
          }
          case "ArrowDown": {
            selectAndBlurEditor();
            return;
          }
          case "ArrowUp": {
            selectAndBlurEditor();
            return;
          }
          case "Enter": {
            if (isSelected) {
              handleClick(AVAILABLE_COMMANDS[0].command)();
            }
            return;
          }
        }
      }
    };

    document.addEventListener("keydown", handleNavigateCommands);
    return () => {
      document.removeEventListener("keydown", handleNavigateCommands);
    };
  }, [isSelected]);

  const handleClick = (command: string) => () => {
    let typedInput = getWordBefore(editor)?.word;
    typedInput = typedInput?.replace("/", "");
    if (!target || !typedInput) return;

    const command_ = command.replace(typedInput, "");
    insertCommand(editor, command_);
    setTarget(null);
  };

  return (
    <div className="mx-2 mb-2 rounded-t-md border border-border bg-foreground text-sm text-muted-contrast">
      <p className="border-b border-border p-2 text-sm">Available Commands: </p>
      <ul className="cursor-pointer space-y-4 text-xs">
        {AVAILABLE_COMMANDS.map((i) => (
          <li
            className={clsx(
              "flex flex-col space-y-1 p-2 hover:bg-secondary",
              isSelected && "bg-foreground",
            )}
            key={i.command}
            onClick={handleClick(i.command)}
          >
            <span className="block font-mono font-bold">
              {i.command} [text]
            </span>
            <span className="text-muted-contrast">{i.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CommandsPopup;

const insertCommand = (editor: Editor, text: string) => {
  Transforms.insertText(editor, `${text} `);
  Transforms.move(editor);
  ReactEditor.focus(editor);
};
