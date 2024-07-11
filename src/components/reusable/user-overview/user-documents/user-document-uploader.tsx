import type { UploadResult } from "@uppy/core";
import { Upload } from "lucide-react";
import React from "react";
import { useTranslation } from "react-i18next";
import { getDownloadUrlsFromUploadResult } from "@/src/client-functions/client-cloudflare/utils";
import type { ReducedR2ObjectWithName } from "@/src/types/storage.types";
import type { InstitutionUserManagementUser } from "@/src/types/user-management.types";
import { log } from "@/src/utils/logger/logger";
import { maxFileSizes } from "@/src/utils/utils";
import useUser from "@/src/zustand/user";
import FileDropover from "../../file-uploaders/file-drop-over";
import { Button } from "../../shadcn-ui/button";

export default function UserDocumentUploader({
  user,
  userDocuments,
  setUserDocuments,
}: {
  user?: InstitutionUserManagementUser | null;
  userDocuments: ReducedR2ObjectWithName[];
  setUserDocuments: (data: ReducedR2ObjectWithName[]) => void;
}) {
  const { t } = useTranslation("page");
  const { user: userFromZustand } = useUser();

  if (!user) return <></>;
  return (
    <FileDropover
      uploadPathData={{
        type: "user-documents",
        userId: user.id,
      }}
      maxFileAmount={100}
      maxFileSize={maxFileSizes.files}
      closeDropOverOnFinish
      onUploadFinish={(result: UploadResult) => {
        const urls = getDownloadUrlsFromUploadResult(result);
        if (urls.length > 0) {
          log.info("User documents was uploaded", urls[0]);
        }
        const files = [...userDocuments];
        result.successful.forEach((file) => {
          files.push({
            name: file.name,
            Key:
              "institutions/" +
              userFromZustand.currentInstitutionId +
              "/user/" +
              user.id +
              "/" +
              file.name,
            LastModified: new Date(),
            Size: file.size,
          });
        });
        setUserDocuments(files);
      }}
    >
      <Button className="flex gap-2" variant={"cta"}>
        {<Upload className="size-4" />}
        <div>{t("upload")}</div>
      </Button>
    </FileDropover>
  );
}
