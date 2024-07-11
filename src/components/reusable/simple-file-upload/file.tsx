import { FileIcon, XIcon } from "lucide-react";
import type { SyntheticEvent } from "react";
import React from "react";
import { useTranslation } from "react-i18next";

type Props = {
  filename: string;
  onReset: () => void;
  onClick: (e: SyntheticEvent) => void;
};

export default function File({ filename, onClick, onReset }: Props) {
  const { t } = useTranslation("page");
  return (
    <div className="absolute inset-0 flex h-full w-full flex-col items-center justify-center">
      <button
        className="absolute right-2 top-1 text-sm text-primary/70 hover:text-primary"
        onClick={onReset}
      >
        {t("general.cancel")}
      </button>
      <button
        className="relative space-y-3 rounded-md border border-border bg-foreground px-8 pb-4 pt-3 text-sm text-muted-contrast"
        onClick={onClick}
      >
        <XIcon
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onReset();
          }}
          size={18}
          className="absolute right-2 top-2 text-white/70 transition-colors hover:text-white"
        />
        <FileIcon size={64} fill="white" />
        <p>{filename}</p>
      </button>
    </div>
  );
}
