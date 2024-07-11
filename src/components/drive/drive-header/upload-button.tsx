import dayjs from "dayjs";
import { Upload } from "lucide-react";
import { useMemo } from "react";
import {
  useDrive,
  useDriveType,
  useDynamicDrive,
} from "@/src/client-functions/client-cloudflare/hooks";
import {
  getDownloadUrlFromUploadUrl,
  getKeyFromUrl,
} from "@/src/client-functions/client-cloudflare/utils";
import useUser from "@/src/zustand/user";
import useCourse from "../../course/zustand";
import FileDropover from "../../reusable/file-uploaders/file-drop-over";
import { Button } from "../../reusable/shadcn-ui/button";

export function UploadButton() {
  const { user } = useUser();
  dayjs.locale(user.language);
  const { openedFolderId } = useDynamicDrive();
  const drive = useDrive();
  const { course } = useCourse();
  const driveType = useDriveType();
  const subPath = useMemo(
    () =>
      openedFolderId === ""
        ? undefined
        : drive.utils.getSubPath(openedFolderId),
    [openedFolderId],
  );

  return (
    <FileDropover
      uploadPathData={
        driveType === "course-drive"
          ? {
              type: driveType,
              subPath,
              layerId: course.layer_id,
            }
          : {
              type: driveType,
              subPath,
            }
      }
      autoProceed
      maxFileAmount={100}
      onUploadFinish={(result) => {
        result.successful.forEach((file) => {
          const key = getKeyFromUrl(
            getDownloadUrlFromUploadUrl(file.uploadURL),
          );
          drive.client.create.dummySubdirectory(
            openedFolderId === "" ? drive.utils.getBasePath() : openedFolderId,
            {
              Key: key,
              Size: file.size,
              LastModified: new Date(),
            },
          );
        });
      }}
    >
      <Button variant={"ghost"}>
        <Upload className="size-4" />
      </Button>
    </FileDropover>
  );
}
