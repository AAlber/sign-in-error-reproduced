import { useContext } from "react";
import { DriveTypeContext } from "@/src/components/drive/drive-type-provider";
import { useCourseDrive, useUserDrive } from "@/src/components/drive/zustand";
import { courseDrive, userDrive } from "../client-drive/drive-builder";

export const useDriveType = () => useContext(DriveTypeContext);

export const useDynamicDrive = () => {
  const storeType = useDriveType();
  // Hook initialization at the top level
  const userDriveStore = useUserDrive();
  const courseDriveStore = useCourseDrive();

  // Conditional return based on storeType
  return storeType === "user-drive" ? userDriveStore : courseDriveStore;
};

export const useDrive = () => {
  const driveType = useDriveType();
  const drive = driveType === "user-drive" ? userDrive : courseDrive;
  return drive;
};
