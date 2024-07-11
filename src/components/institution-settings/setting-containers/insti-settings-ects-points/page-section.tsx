import { useQueryClient } from "@tanstack/react-query";
import { getFilenameFromUrl } from "pdfjs-dist";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { deleteFile } from "@/src/client-functions/client-ects";
import { downloadFileFromUrl } from "@/src/client-functions/client-utils";
import FileDropover from "@/src/components/reusable/file-uploaders/file-drop-over";
import { Button } from "@/src/components/reusable/shadcn-ui/button";
import type { FileUploadPathData } from "@/src/types/storage.types";
import { ECTS_FILE_UPLOAD_QUERY_KEY } from "./index";

type Props = {
  title: string;
  subtitle: string;
  uploadPathData: FileUploadPathData;
  fileKey?: string;
  onUploadFinish: (url: string) => Promise<void>;
};

export default function PageSection({
  fileKey,
  subtitle,
  title,
  uploadPathData,
  onUploadFinish,
}: Props) {
  const { t } = useTranslation("page");
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();

  const refetch = () =>
    queryClient.refetchQueries({ queryKey: ECTS_FILE_UPLOAD_QUERY_KEY });

  const url = process.env.NEXT_PUBLIC_WORKER_URL! + "/" + fileKey;
  const handleDownloadExistingFile = async () => {
    if (!fileKey) return;
    setIsLoading(true);
    console.log("url", url);
    const fileName = decodeURIComponent(getFilenameFromUrl(url));
    await downloadFileFromUrl(fileName, url);
    setIsLoading(false);
  };

  const handleDeleteFile = async () => {
    if (!fileKey) return;
    setIsLoading(true);

    await deleteFile(url);
    await refetch();
    setIsLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h3 className="text-contrast">{t(title)}</h3>
        <p className="text-xs text-muted-contrast">{t(subtitle)}</p>
      </div>
      <div className="flex justify-start space-x-4">
        {!!fileKey && (
          <>
            <Button
              variant="cta"
              onClick={handleDownloadExistingFile}
              loading={isLoading}
            >
              {t("ects_settings.section.download_file")}
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteFile}
              loading={isLoading}
            >
              {t("ects_settings.section.delete_file")}
            </Button>
          </>
        )}
        <div>
          <FileDropover
            uploadPathData={uploadPathData}
            autoProceed
            allowedFileTypes={["application/pdf"]}
            closeDropOverOnFinish
            onUploadCompleted={async (url: string) => {
              await onUploadFinish(url);
              await refetch();
            }}
          >
            <Button loading={isLoading}>
              {!!fileKey
                ? t("ects_settings.section.upload_new_file")
                : t("ects_settings.section.upload_file")}
            </Button>
          </FileDropover>
        </div>
      </div>
    </div>
  );
}
