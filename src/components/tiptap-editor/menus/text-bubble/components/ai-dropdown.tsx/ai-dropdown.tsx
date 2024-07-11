import type { Editor } from "@tiptap/react";
import {
  ChevronFirst,
  ChevronLast,
  ChevronRight,
  Circle,
  Eraser,
  Languages,
  Mic,
  MoreHorizontal,
  Pencil,
  Sparkles,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useTextCommands } from "@/src/components/tiptap-editor/hooks";
import { LANGUAGES, TONES } from "@/src/utils/tiptap-editor/constants";
import SelectionMenu from "../../../../selection-menu";

type AIDropdownOption =
  | {
      type: "button";
      label: string;
      icon: JSX.Element;
      onClick: () => boolean;
    }
  | {
      type: "dropdown";
      label: string;
      icon: JSX.Element;
      options: {
        label: string;
        onClick: () => boolean;
      }[];
    };

export const AIDropdown = ({ editor }: { editor: Editor }) => {
  const { t } = useTranslation("page");
  const textCommmands = useTextCommands(editor);

  const options: AIDropdownOption[] = [
    {
      type: "button",
      label: "ai_tools.simplify",
      icon: <Circle className="h-4 w-4" />,
      onClick: () => textCommmands.onSimplify(),
    },
    {
      type: "button",
      label: "ai_tools.fix_spelling",
      icon: <Eraser className="h-4 w-4" />,
      onClick: () => textCommmands.onFixSpelling(),
    },
    {
      type: "button",
      label: "ai_tools.make_shorter",
      icon: <ChevronFirst className="h-4 w-4" />,
      onClick: () => textCommmands.onMakeShorter(),
    },
    {
      type: "button",
      label: "ai_tools.make_longer",
      icon: <ChevronLast className="h-4 w-4" />,
      onClick: () => textCommmands.onMakeLonger(),
    },
    {
      type: "dropdown",
      label: "ai_tools.change_tone",
      icon: <Mic className="h-4 w-4" />,
      options: TONES.map((tone) => ({
        label: `ai_tools.change_tone.${tone.name}`,
        onClick: () => textCommmands.onTone(tone.value),
      })),
    },
    {
      type: "button",
      label: "ai_tools.tldr",
      icon: <MoreHorizontal className="h-4 w-4" />,
      onClick: () => textCommmands.onTldr(),
    },
    {
      type: "dropdown",
      label: "ai_tools.translate",
      icon: <Languages className="h-4 w-4" />,
      options: LANGUAGES.map((language) => ({
        label: `ai_tools.translate.${language.name}`,
        onClick: () => textCommmands.onTranslate(language.value),
      })),
    },
    {
      type: "button",
      label: "ai_tools.complete_sentence",
      icon: <Pencil className="h-4 w-4" />,
      onClick: () => textCommmands.onCompleteSentence(),
    },
  ];

  return (
    <SelectionMenu.Dropdown>
      <SelectionMenu.DropdownTrigger>
        <SelectionMenu.Button>
          <div className="flex items-center gap-2 font-medium text-primary">
            <Sparkles className="h-4 w-4 text-primary" />
            {t("ai.tools")}
          </div>
        </SelectionMenu.Button>
      </SelectionMenu.DropdownTrigger>
      <SelectionMenu.DropdownContent>
        {options.map((option) => {
          if (option.type === "dropdown") {
            return (
              <SelectionMenu.Dropdown key={option.label}>
                <SelectionMenu.DropdownTrigger>
                  <SelectionMenu.DropdownItem>
                    <div className="flex w-full items-center justify-between">
                      <div className="flex items-center gap-2">
                        {option.icon}
                        {t(option.label)}
                      </div>
                      <ChevronRight className="h-4 w-4" />
                    </div>
                  </SelectionMenu.DropdownItem>
                </SelectionMenu.DropdownTrigger>
                <SelectionMenu.DropdownContent
                  side="right"
                  align="start"
                  alignOffset={-6}
                  className="max-h-72 overflow-y-scroll"
                >
                  {option.options.map((option) => (
                    <SelectionMenu.DropdownItem
                      key={option.label}
                      onClick={option.onClick}
                    >
                      {t(option.label)}
                    </SelectionMenu.DropdownItem>
                  ))}
                </SelectionMenu.DropdownContent>
              </SelectionMenu.Dropdown>
            );
          }

          return (
            <SelectionMenu.DropdownItem
              key={option.label}
              onClick={option.onClick}
            >
              {option.icon}
              {t(option.label)}
            </SelectionMenu.DropdownItem>
          );
        })}
      </SelectionMenu.DropdownContent>
    </SelectionMenu.Dropdown>
  );
};
