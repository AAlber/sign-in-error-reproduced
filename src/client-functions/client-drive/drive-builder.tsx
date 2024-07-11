import type { DriveZustand } from "@/src/components/drive/zustand";
import { useCourseDrive, useUserDrive } from "@/src/components/drive/zustand";
import type { DriveTypes } from "@/src/types/storage.types";
import { DriveAPIOperations } from "./drive-backend-operations";
import { DriveFileTransferOperations } from "./drive-file-transfer-operations";
import { DriveHandler } from "./drive-handler";
import { DriveInteractionOperations } from "./drive-interaction-operations";
import { DriveStateOperations } from "./drive-state-operations";
import { DriveTreeOperations } from "./drive-tree-operations";
import { DriveUtilOperations } from "./drive-util-operations";

class DriveOperationsBuilder {
  private driveType: DriveTypes;
  private zustand: () => DriveZustand;

  constructor(driveType: DriveTypes) {
    this.driveType = driveType;
    this.zustand = () =>
      this.driveType === "user-drive"
        ? useUserDrive.getState()
        : useCourseDrive.getState();
  }

  build(): DriveHandler {
    const driveUtilOperations = new DriveUtilOperations(
      this.driveType,
      this.zustand,
    );
    const driveTreeOperations = new DriveTreeOperations(
      this.zustand,
      driveUtilOperations,
    );
    const driveStateOperations = new DriveStateOperations(
      this.zustand,
      driveUtilOperations,
    );
    const driveTransferOperations = new DriveFileTransferOperations(
      this.zustand,
      driveStateOperations,
    );
    const driveInteractionOperations = new DriveInteractionOperations(
      this.zustand,
      this.driveType,
      driveUtilOperations,
      driveStateOperations,
      driveTransferOperations,
    );
    const driveCloudflareOperations = new DriveAPIOperations(
      this.zustand,
      this.driveType,
      driveStateOperations,
      driveUtilOperations,
      driveTransferOperations,
    );
    return new DriveHandler(
      driveCloudflareOperations,
      driveInteractionOperations,
      driveUtilOperations,
      driveTreeOperations,
      driveStateOperations,
    );
  }
}

export const courseDrive = new DriveOperationsBuilder("course-drive").build();
export const userDrive = new DriveOperationsBuilder("user-drive").build();
