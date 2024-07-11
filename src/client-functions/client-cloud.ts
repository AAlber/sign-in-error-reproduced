import { FuxamDrive } from "../components/cloud-overlay/classes/fuxam-drive";
import useCloudOverlay from "../components/cloud-overlay/zustand";
import type { OnSelectArgs } from "../components/reusable/page-layout/navigator/zustand";
import { toast } from "../components/reusable/toaster/toast";
import type { WorkbenchContent } from "../components/workbench-deprecated/types";
import useWorkbench, {
  WorkbenchType,
} from "../components/workbench-deprecated/zustand";
import useFile, { OpenOrigin } from "../file-handlers/zustand";

export const getInitialDrive = (userId: string) => {
  const {
    drive,
    googlePath,
    currentPath,
    setCurrentPath,
    setFuxamLastFolder,
    setGooglePath,
    setUploadStep,
    setGoogleLastFolder,
    setLoaded,
    setFiles,
  } = useCloudOverlay.getState();

  return new FuxamDrive(
    userId,
    [],
    null,
    currentPath,
    setCurrentPath,
    setFuxamLastFolder,
    setLoaded,
    setFiles,
    setUploadStep,
  );
};

export const openWorkbenchFile = async (args: OnSelectArgs) => {
  const { openWorkbenchWithContent } = useWorkbench.getState();
  const { fileBlob, errorDescription, openOrigin, fileName } = args;
  const { setOpenedFrom } = useFile.getState();
  setOpenedFrom(openOrigin);
  try {
    const text = await fileBlob.text();

    const content = JSON.parse(text.toString()) as WorkbenchContent;

    if (!content.pages) {
      toast.error("toast_client_cloud_error", {
        description: errorDescription,
      });
      return;
    }
    let workbenchType = WorkbenchType.LEARNING;
    if (fileName?.endsWith(".assess")) {
      workbenchType = WorkbenchType.ASSESSMENT;
    }
    if (
      openOrigin === OpenOrigin.LobbyChat ||
      openOrigin === OpenOrigin.LearningBlocks
    ) {
      openWorkbenchWithContent({
        content: content,
        workbenchType: workbenchType,
        readOnly: true,
      });
    } else {
      openWorkbenchWithContent({
        content: content,
        workbenchType: workbenchType,
      });
    }
  } catch (e) {
    toast.error("toast_client_cloud_error", {
      description: (e as Error).message,
    });
  }
};

export function getFileExtension(filename: string): string {
  return "." + filename.split(".").pop() || "";
}

export function removeDisabledFolder(folderId) {
  const { disabledFolders, setDisabledFolders } = useCloudOverlay.getState();
  const newDisabledFolders = [...disabledFolders].filter(
    (folder) => folder !== folderId,
  );
  setDisabledFolders(newDisabledFolders);
}

export function convertToKilobytesOrMegabytes(bytes: number): string {
  const kilobytes = bytes / 1024;
  const megabytes = kilobytes / 1024;
  const gigabytes = megabytes / 1024;
  if (kilobytes < 1024) {
    return kilobytes.toFixed(1) + " KB";
  } else if (megabytes < 1024) {
    return megabytes.toFixed(1) + " MB";
  } else if (gigabytes < 1024) {
    return gigabytes.toFixed(1) + " GB";
  }
  return "";
}
