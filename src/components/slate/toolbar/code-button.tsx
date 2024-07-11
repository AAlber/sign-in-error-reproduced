import { langs } from "@uiw/codemirror-extensions-langs";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import { xcodeLight } from "@uiw/codemirror-theme-xcode";
import ReactCodeMirror from "@uiw/react-codemirror";
import clsx from "clsx";
import { Code2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useMediaQuery } from "react-responsive";
import { toast } from "@/src/components/reusable/toaster/toast";
import { Button } from "../../reusable/shadcn-ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "../../reusable/shadcn-ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../reusable/shadcn-ui/select";
import {
  type ProgrammingLanguage,
  programmingLanguages,
} from "../../workbench-deprecated/elements/element-code/zustand";
import { useCustomSlateContext } from "../provider";
import { toolbar, toolsIconContainerStyle } from "../styles";

export const renderLanguage = (language: ProgrammingLanguage["name"]) => {
  switch (language) {
    case "Python": {
      return langs.python();
    }
    case "JavaScript": {
      return langs.javascript();
    }
    case "Java": {
      return langs.java();
    }
    case "C++": {
      return langs.cpp();
    }
    case "C#": {
      return langs.csharp();
    }
    case "C": {
      return langs.c();
    }
    case "Swift": {
      return langs.swift();
    }
    default:
      return langs.rust();
  }
};

type Field = {
  code: string;
};

// Getstream chat messaging has a max limit of 5000 chars
const TEXT_LIMIT = 3500;

const CodeButton = () => {
  const isDark = useMediaQuery({ query: "(prefers-color-scheme: dark)" });
  const { t } = useTranslation("page");
  const { setCodeMessage } = useCustomSlateContext();
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [language, setLanguage] =
    useState<ProgrammingLanguage["name"]>("JavaScript");

  const { control, handleSubmit, watch } = useForm<Field>({
    defaultValues: {
      code: `// ${t("chat.toolbar.code.placeholder")}`,
    },
    reValidateMode: "onChange",
  });

  const count = watch("code").length;
  const placeholder = programmingLanguages[1];

  const handleConfirm = (val: Field) => {
    setCodeMessage({ code: val.code, language });
    setDialogOpen(false);
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger
        className={clsx(
          toolsIconContainerStyle,
          toolbar,
          "text-muted-contrast",
        )}
      >
        <Code2 size={18} />
      </DialogTrigger>
      <DialogContent
        className="min-w-full max-w-[800px] lg:!min-w-[70vw] xl:!min-w-[60vw]"
        onWheel={(e) => {
          e.stopPropagation();
        }}
      >
        <DialogTitle>{t("chat.toolbar.code.title")}</DialogTitle>
        <div className="flex items-center justify-between">
          <Select
            onValueChange={(val) => {
              setLanguage(val as ProgrammingLanguage["name"]);
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue
                placeholder={
                  <div className="flex space-x-2">
                    <Image
                      src={placeholder?.logo ?? ""}
                      width={16}
                      height={16}
                      className="inline-block"
                      alt={placeholder?.name ?? ""}
                    />
                    <span>{placeholder?.name}</span>
                  </div>
                }
              />
            </SelectTrigger>
            <SelectContent>
              {programmingLanguages.map(({ name, logo }) => {
                return (
                  <SelectItem
                    key={name}
                    value={name}
                    className="cursor-pointer hover:bg-accent"
                  >
                    <Image
                      src={logo}
                      width={16}
                      height={16}
                      alt={name}
                      className="mr-2 inline-block"
                    />
                    <span>{name}</span>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>
        <Controller
          control={control}
          name="code"
          rules={{
            maxLength: TEXT_LIMIT,
          }}
          render={({ field }) => {
            return (
              <ReactCodeMirror
                readOnly={false}
                theme={isDark ? vscodeDark : xcodeLight}
                extensions={[renderLanguage(language)]}
                className="overflow-x-scroll rounded-md border border-border"
                height="400px"
                {...field}
              />
            );
          }}
        />
        {count > TEXT_LIMIT && (
          <span className="text-right text-sm">
            {t("chat.toolbar.code.limit_warning")}
          </span>
        )}
        <DialogFooter className="flex items-center">
          <p
            className={clsx(
              "text-right text-xs",
              count > TEXT_LIMIT && "text-destructive",
            )}
          >
            {count}/{TEXT_LIMIT}
          </p>
          <Button
            variant={"cta"}
            onClick={() => {
              if (count >= TEXT_LIMIT) {
                toast.warning("chat.message.input.file_warning_title", {
                  description: "chat.toolbar.code.limit_warning_description",
                });
                return;
              }
              handleSubmit(handleConfirm)();
            }}
          >
            {t("general.confirm")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CodeButton;
