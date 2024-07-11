import {
  createContext,
  type PropsWithChildren,
  useContext,
  useState,
} from "react";
import type { Descendant } from "slate";
import { createEditor } from "slate";
import { withHistory } from "slate-history";
import { Slate, withReact } from "slate-react";
import type { MessageContextValue } from "stream-chat-react";
import type { StreamChatGenerics } from "../reusable/page-layout/navigator/chat/types";
import type { ProgrammingLanguage } from "../workbench-deprecated/elements/element-code/zustand";
import CommandsPopup from "./commands-popup";
import useSlashCommands from "./hooks/useSlashCommands";
import { withPlugins } from "./plugins/withPlugins";
import type { TargetType } from "./types";

export const slateInitialValue: Descendant[] = [
  { type: "paragraph", children: [{ text: "" }] },
];

type SlateInputEdit = {
  isEditing: true;
  messageToEdit: MessageContextValue<StreamChatGenerics>["message"];
  clearEditingState: MessageContextValue<StreamChatGenerics>["clearEditingState"];
};

type SlateInputRegular = {
  isEditing?: never;
};

export type SlateProviderProps = (SlateInputEdit | SlateInputRegular) & {
  initialValue?: Descendant[];
  listenForSlashCommands?: boolean;
  isEditing?: boolean;
  isChatMode?: boolean;
};

/**
 * Need to use contexts here as there can be multiple instances
 * of the slate provider, for example 1 is the normal chat, another is when editing,
 * and another when we are inside fillout mode of contentBlocks text or paragraph
 */
export const SlateProvider: React.FC<PropsWithChildren<SlateProviderProps>> = (
  props,
) => {
  const {
    initialValue = [...slateInitialValue],
    isChatMode = true,
    listenForSlashCommands = false,
    children,
  } = props;

  const [editor] = useState(
    withPlugins(withReact(withHistory(createEditor()))),
  );

  const [target, setTarget] = useState<TargetType>();
  const [codeMessage, setCodeMessage] = useState<WithCode | undefined>();

  const { listenCommands } = useSlashCommands({
    enabled: listenForSlashCommands,
    editor,
    target,
    setTarget,
  });

  const onChange = () => {
    listenCommands();
  };

  const isEditingProps =
    isChatMode && props.isEditing
      ? {
          isEditing: true as const,
          messageToEdit: props.messageToEdit,
          clearEditingState: props.clearEditingState,
        }
      : {};

  return (
    <Slate editor={editor} initialValue={initialValue} onChange={onChange}>
      <CustomSlateContext.Provider
        value={{
          listenForSlashCommands,
          initialValue,
          codeMessage,
          setCodeMessage,
          isChatMode,
          ...isEditingProps,
        }}
      >
        {listenForSlashCommands && target && (
          <CommandsPopup
            target={target}
            setTarget={setTarget}
            editor={editor}
          />
        )}
        {children}
      </CustomSlateContext.Provider>
    </Slate>
  );
};

type WithCode = {
  code: string;
  language: ProgrammingLanguage["name"];
};

export type SlateCode = {
  codeMessage: WithCode | undefined;
  setCodeMessage: React.Dispatch<React.SetStateAction<WithCode | undefined>>;
};

export const CustomSlateContext = createContext(
  {} as SlateProviderProps & SlateCode,
);
export const useCustomSlateContext = () => useContext(CustomSlateContext);
