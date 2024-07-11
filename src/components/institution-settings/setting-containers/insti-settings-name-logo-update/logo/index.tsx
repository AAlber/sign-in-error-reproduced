import Image from "next/image";
import { useTranslation } from "react-i18next";
import { deleteCloudflareDirectories } from "@/src/client-functions/client-cloudflare";
import { updateInstitutionGeneralInfo } from "@/src/client-functions/client-institution";
import FileDropover from "@/src/components/reusable/file-uploaders/file-drop-over";
import { Button } from "@/src/components/reusable/shadcn-ui/button";
import type { UserData } from "@/src/types/user-data.types";
import { imageFileTypes, maxFileSizes } from "@/src/utils/utils";
import useUser from "@/src/zustand/user";
import DeleteLogoButton from "./delete-button";

export default function LogoComponent(data: UserData) {
  const { t } = useTranslation("page");
  const { user } = useUser();

  return (
    <div className="col-span-full flex items-center gap-x-8">
      <div className="flex size-24 items-center justify-center rounded-lg border border-border object-cover p-2">
        <Image
          src={
            user.institution?.logo
              ? user.institution.logo
              : "/images/no-photo.webp"
          }
          alt=""
          width={96}
          height={96}
        />
      </div>
      <div className="flex gap-4">
        <FileDropover
          title={"upload_logo_title"}
          maxFileSize={maxFileSizes.images}
          allowedFileTypes={imageFileTypes}
          description={"upload_logo_description"}
          onUploadCompleted={async (url: string) => {
            const previousLogo = user.institution?.logo;
            await Promise.all([
              updateInstitutionGeneralInfo({
                logoLink: url,
              }),
              previousLogo &&
                deleteCloudflareDirectories(
                  [
                    {
                      url: previousLogo,
                      isFolder: false,
                    },
                  ],
                  false,
                ),
            ]);
          }}
          uploadPathData={{
            type: "logo",
          }}
        >
          <Button>{t("update_logo")}</Button>
        </FileDropover>
        <DeleteLogoButton />
      </div>
    </div>
  );
}
