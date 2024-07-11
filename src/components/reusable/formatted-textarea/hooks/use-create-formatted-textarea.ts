import type { EditorOptions, JSONContent } from "@tiptap/react";
import { useEditor as useTiptapEditor } from "@tiptap/react";
import { useContext, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  getExtensionsForFeatures,
  getOmitSlashMenuCommands,
  isFeatureEnabled,
} from "@/src/client-functions/client-formatted-textarea";
import { PickExtensions } from "@/src/components/tiptap-editor";
import type {
  TiptapEditorFeatures,
  TiptapEditorMenus,
} from "@/src/components/tiptap-editor/types";
import { FormattedTextareaContext } from "../context";

type EditorOptionsProp = Partial<
  Pick<
    EditorOptions,
    "autofocus" | "editable" | "onBlur" | "onUpdate" | "onFocus"
  >
>;

interface Props extends EditorOptionsProp {
  defaultContent?: JSONContent | string;
  menus?: TiptapEditorMenus;
  features?: TiptapEditorFeatures;
  className?: string;
}

export const useCreateFormattedTextarea = ({
  features = {},
  menus = {},
  defaultContent,
  ...editorOptions
}: Props) => {
  const { t } = useTranslation("page");

  const extensionNames = useMemo(
    () => getExtensionsForFeatures(features),
    [features],
  );

  const omitSlashMenuCommand = useMemo(
    () => [
      ...getOmitSlashMenuCommands(features),
      ...(features?.slashCommand?.omitSlashMenuCommand ?? []),
    ],
    [features.slashCommand],
  );

  const { SlashCommand, StarterKit, Placeholder, AI, ...restExtensions } =
    PickExtensions(t)(...extensionNames);

  const context = useContext(FormattedTextareaContext);

  const tiptapEditor = useTiptapEditor({
    editorProps: {
      attributes: {
        class: `focus:outline-none ${editorOptions.className ?? ""}`,
      },
    },
    autofocus: true,
    content: defaultContent || "",
    extensions: [
      StarterKit.configure(
        isFeatureEnabled(features, "heading", true) ? {} : { heading: false },
      ),
      ...(isFeatureEnabled(features, "ai", false)
        ? [
            AI.configure({
              appId: "0k3zzr95",
              token: features?.ai?.aiToken ?? "",
              autocompletion: true,
            }),
          ]
        : []),
      ...(isFeatureEnabled(features, "placeholder", false)
        ? [
            features.placeholder?.placeholderContent
              ? Placeholder.configure({
                  placeholder: (props) => {
                    if (
                      features.placeholder?.placeholderContent instanceof
                      Function
                    )
                      return t(features.placeholder?.placeholderContent(props));

                    return t(features.placeholder?.placeholderContent ?? "");
                  },
                })
              : Placeholder,
          ]
        : []),
      SlashCommand.configure({
        removeCommands: omitSlashMenuCommand,
      }),
      ...Object.values(restExtensions),
    ],
    ...editorOptions,
  });

  useEffect(() => {
    if (!tiptapEditor) return;

    context?.initTiptapEditor(tiptapEditor);
  }, [tiptapEditor]);

  return { tiptapEditor, features, menus };
};
