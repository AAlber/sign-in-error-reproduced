import { useTranslation } from "react-i18next";
import { deleteCloudflareDirectories } from "@/src/client-functions/client-cloudflare";
import { getDownloadUrlsFromUploadResult } from "@/src/client-functions/client-cloudflare/utils";
import contentBlockHandler from "@/src/client-functions/client-contentblock/handler";
import { requireStatementOfIndependenceIfEnabledOrProceed } from "@/src/client-functions/client-utils";
import { Button } from "@/src/components/reusable/shadcn-ui/button";
import { toast } from "@/src/components/reusable/toaster/toast";
import type { ContentBlock } from "@/src/types/course.types";

export const HandInUploadButton = ({
  block,
  fileUrl,
  setChangeFile,
  fileExists,
  uploading,
  setUploading,
  uppy,
  loading,
  comment,
}: {
  block: ContentBlock;
  fileUrl: string;
  setChangeFile: (change: boolean) => void;
  fileExists: boolean;
  uploading: boolean;
  setUploading: (uploading: boolean) => void;
  uppy: any;
  loading: boolean;
  comment: string;
}) => {
  const { t } = useTranslation("page");
  return (
    <Button
      disabled={!fileExists || uploading || loading}
      className="w-full"
      variant={"cta"}
      onClick={async () => {
        if (!fileExists) return;
        requireStatementOfIndependenceIfEnabledOrProceed(async () => {
          setUploading(true);
          const result = await uppy?.upload();
          const url = getDownloadUrlsFromUploadResult(result!)[0];
          if (!url) {
            return toast.error("toast_hand_in_error3", {});
          }
          if (fileUrl)
            await deleteCloudflareDirectories([
              {
                url: fileUrl,
                isFolder: false,
              },
            ]);
          await contentBlockHandler.userStatus.update<"HandIn">({
            blockId: block.id,
            data: {
              status: "FINISHED",
              userData: {
                url,
                uploadedAt: new Date(),
                comment,
              },
            },
          });
          contentBlockHandler.userStatus.finish(block.id);
          setUploading(false);
          setChangeFile(false);
        });
      }}
    >
      {t(uploading ? "general.loading" : "drop_file_upload")}
    </Button>
  );
};
