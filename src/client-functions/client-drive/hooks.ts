import { useCallback, useEffect } from "react";
import { useUserDriveModal } from "@/src/components/dashboard/navigation/primary-sidebar/user-drive/zustand";
import { useDrive, useDriveType } from "../client-cloudflare/hooks";

export const useDriveCopyPaste = () => {
  const { open } = useUserDriveModal();
  const drive = useDrive();
  const driveType = useDriveType();
  const handlePaste = useCallback(
    (e) => {
      drive.client.handle.paste(e);
    },
    [drive.client.handle],
  ); // Ensure dependencies are stable

  const handleCopy = useCallback(
    (e) => {
      drive.client.handle.copy(e);
    },
    [drive.client.handle],
  );
  useEffect(() => {
    const handlePasteGlobal = (event) => {
      if (open || driveType === "course-drive") {
        handlePaste(event);
      }
    };
    const handleCopyGlobal = (event) => {
      if (open || driveType === "course-drive") {
        handleCopy(event);
      }
    };

    window.addEventListener("paste", handlePasteGlobal);
    window.addEventListener("keydown", handleCopyGlobal);

    return () => {
      window.removeEventListener("paste", handlePasteGlobal);
      window.removeEventListener("keydown", handleCopyGlobal);
    };
  }, [open, handlePaste, handleCopy]);
  return { handlePaste, handleCopy };
};
