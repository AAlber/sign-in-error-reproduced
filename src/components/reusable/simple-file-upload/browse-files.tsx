import { FileUpIcon } from "lucide-react";
import type { SyntheticEvent } from "react";
import React from "react";
import { useTranslation } from "react-i18next";

type Props = {
  dragActive: boolean;
  onClick: (e: SyntheticEvent) => void;
};

export default function BrowseFiles({ dragActive, onClick }: Props) {
  const { t } = useTranslation("page");

  if (dragActive) {
    return (
      <div className="flex items-center justify-center text-primary">
        <FileUpIcon size={64} />
      </div>
    );
  }

  return (
    <label
      htmlFor="input-file-upload"
      className="flex cursor-pointer justify-center space-x-1 text-center text-sm text-muted-contrast transition-colors hover:text-contrast"
    >
      <p>{t("drop_file_here_or_title")}</p>
      <button className="text-primary hover:underline" onClick={onClick}>
        {t("browse_files")}
      </button>
    </label>
  );
}
