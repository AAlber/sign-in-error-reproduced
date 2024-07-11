import { langs } from "@uiw/codemirror-extensions-langs";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import { xcodeLight } from "@uiw/codemirror-theme-xcode";
import CodeMirror from "@uiw/react-codemirror";
import { useTheme } from "next-themes";
import { Controller } from "react-hook-form";
import {
  areObjectsValueEqual,
  useCustomForm,
} from "@/src/client-functions/client-workbench";
import useWorkbench from "../../zustand";
import TaskInput from "../misc/task-input";
import { LanguageSelector } from "./language-selector";
import { useCodeTask } from "./zustand";

type CodeField = {
  code: string;
};

export function ElementBody(elementId) {
  const { getElementMetadata, updateElementMetadata, mode } = useWorkbench();
  const { selectedLanguage } = useCodeTask();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const code = getElementMetadata(elementId).code ?? "";

  const { control, handleSubmit } = useCustomForm({
    elementId,
    key: "code",
    formProps: { defaultValues: { code } },
    onSubmitHandler: handleUpdateMeta,
  });

  function handleUpdateMeta(value: CodeField) {
    if (areObjectsValueEqual({ code: value.code }, { code })) return;
    updateElementMetadata(elementId, { code: value.code });
  }

  return (
    <div
      className="flex w-full flex-col"
      onBlur={handleSubmit(handleUpdateMeta)}
    >
      <TaskInput elementId={elementId} />
      <div className="relative overflow-hidden rounded-md border border-border">
        <Controller
          control={control}
          name="code"
          render={({ field }) => {
            return (
              <CodeMirror
                readOnly={mode > 1}
                theme={isDark ? vscodeDark : xcodeLight}
                height="400px"
                extensions={[
                  selectedLanguage.name === "Python"
                    ? langs.python()
                    : selectedLanguage.name === "JavaScript"
                    ? langs.javascript()
                    : selectedLanguage.name === "Java"
                    ? langs.java()
                    : selectedLanguage.name === "C++"
                    ? langs.cpp()
                    : selectedLanguage.name === "C#"
                    ? langs.csharp()
                    : selectedLanguage.name === "C"
                    ? langs.c()
                    : selectedLanguage.name === "Swift"
                    ? langs.swift()
                    : langs.rust(),
                ]}
                {...field}
              />
            );
          }}
        />
        <LanguageSelector />
      </div>
    </div>
  );
}
