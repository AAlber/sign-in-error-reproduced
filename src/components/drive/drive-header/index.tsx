import dayjs from "dayjs";
import { X } from "lucide-react";
import {
  useDrive,
  useDriveType,
  useDynamicDrive,
} from "@/src/client-functions/client-cloudflare/hooks";
import { getFileName } from "@/src/client-functions/client-cloudflare/utils";
import useUser from "@/src/zustand/user";
import { useUserDriveModal } from "../../dashboard/navigation/primary-sidebar/user-drive/zustand";
import BetaBadge from "../../reusable/badges/beta";
import { Button } from "../../reusable/shadcn-ui/button";
import Spinner from "../../spinner";
import { DeleteDirectoriesButton } from "./delete-directories-button";
import { DriveArrows } from "./drive-arrows";
import { NewFolderButton } from "./new-folder-button";
import { UploadButton } from "./upload-button";

export function DriveHeader() {
  const { user } = useUser();
  dayjs.locale(user.language);
  const { openedFolderId, reloadingFiles } = useDynamicDrive();
  const drive = useDrive();
  const { setHeaderDragEnabled, isDraggingDrive } = useUserDriveModal();
  const { closeCloud, headerDragEnabled } = useUserDriveModal();
  const driveType = useDriveType();

  return (
    <div
      className={"my-2 flex justify-between"}
      style={{
        cursor: isDraggingDrive
          ? "grabbing"
          : headerDragEnabled
          ? "grab"
          : "default",
      }}
      onMouseEnter={() =>
        driveType === "user-drive" && setHeaderDragEnabled(true)
      }
      onMouseLeave={() =>
        driveType === "user-drive" && setHeaderDragEnabled(false)
      }
    >
      <div className={"flex justify-between"}>
        <div className="flex items-center gap-1">
          <DriveArrows />
          <div className="ml-1 flex gap-2 text-sm font-medium">
            {openedFolderId !== "" ? (
              getFileName(openedFolderId)
            ) : (
              <span className="flex items-center gap-1">
                Drive <BetaBadge />
              </span>
            )}
            {reloadingFiles && <Spinner className="size-4" />}
          </div>
        </div>
      </div>
      {drive.client.get.hasWriteAccess() && (
        <div className="flex items-center gap-1">
          <DeleteDirectoriesButton />
          <NewFolderButton />
          <UploadButton />
          {driveType === "user-drive" && (
            <Button
              variant={"ghost"}
              onClick={() => {
                closeCloud();
              }}
            >
              <X className="size-4 cursor-pointer text-contrast" />
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
