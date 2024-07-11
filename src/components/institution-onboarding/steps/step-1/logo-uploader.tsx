import * as Sentry from "@sentry/nextjs";
import { X } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { truncate } from "@/src/client-functions/client-utils";
import type { FileUploadPathData } from "@/src/types/storage.types";
import { imageFileTypes, maxFileSizes } from "@/src/utils/utils";
import FileDropover from "../../../reusable/file-uploaders/file-drop-over";
import { Button } from "../../../reusable/shadcn-ui/button";

export default function LogoUploader({
  setLogoLink,
  uploadPathData,
}: {
  setLogoLink: (url: string | undefined) => void;
  uploadPathData: FileUploadPathData;
}) {
  const [logoName, setLogoName] = useState<string | undefined>();
  const { t } = useTranslation("page");
  return logoName ? (
    <div className="flex gap-2">
      <Button className="pointer-events-none text-muted-contrast">
        {truncate(logoName, 25)}
      </Button>
      <Button
        onClick={() => {
          setLogoLink(undefined);
          setLogoName(undefined);
        }}
      >
        <X className={"size-4"} />
      </Button>
    </div>
  ) : (
    <FileDropover
      title="upload_logo_title"
      description="upload_logo_description"
      maxFileSize={maxFileSizes.icons}
      uploadPathData={uploadPathData}
      allowedFileTypes={imageFileTypes}
      onUploadCompleted={(url: string) => {
        Sentry.addBreadcrumb({
          message: "logo-uploader/FileDropOver component - upload Finished",
        });
        setLogoLink(url);
        const fileName = decodeURIComponent(url.split("/").pop() || "");
        setLogoName(fileName);
      }}
      autoProceed={true}
    >
      <Button>
        {t("add_logo")}
        <span className="m-auto ml-2 flex justify-end text-xs text-muted-contrast">
          {"max. 4 MB"}
        </span>
      </Button>
    </FileDropover>
  );
}
