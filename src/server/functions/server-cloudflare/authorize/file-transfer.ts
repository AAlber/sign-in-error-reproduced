import type {
  MoveFileAuthData,
  TransferType,
} from "../../../../types/storage.types";
import { log } from "../../../../utils/logger/logger";
import { hasRolesWithAccess } from "../../server-role";
import { getValueAfterSegment } from "../utils";
/**
 * Authorizes file transfers based on the type of transfer and user roles.
 */
export const authorizeFileTransfer = async ({
  moveFilesData,
  transferType,
  userId,
  institutionId,
}: MoveFileAuthData): Promise<boolean> => {
  log
    .info("Authorizing file transfer", {
      ...moveFilesData,
      institutionId,
      userId,
      transferType,
    })
    .cli();

  if (
    !moveFilesData.data.every((transfer) =>
      transfer.destinationKey.startsWith(moveFilesData.destinationBaseKey),
    )
  ) {
    throw new Error("Destination keys must have the same base");
  }

  if (!moveFilesData.data[0]) {
    throw new Error("No files to move");
  }

  const destinationKey = moveFilesData.destinationBaseKey;
  const firstSourceKey = moveFilesData.data[0].sourceKey;

  const transferStrategies: { [key in TransferType]: () => Promise<boolean> } =
    {
      "base-path-mismatch": () => Promise.resolve(false),
      "course-drive": () => hasAccessToCourse("write", userId, destinationKey),
      "user-drive": () =>
        hasAccessToUserDrive(userId, institutionId, destinationKey),
      "course-drive-to-user": () =>
        Promise.all([
          hasAccessToCourse("read", userId, firstSourceKey),
          hasAccessToUserDrive(userId, institutionId, destinationKey),
        ]).then((results) => results.every(Boolean)),
      "user-to-course-drive": () =>
        Promise.all([
          hasAccessToUserDrive(userId, institutionId, firstSourceKey),
          hasAccessToCourse("write", userId, destinationKey),
        ]).then((results) => results.every(Boolean)),
      "course-drive-to-course-drive": () =>
        Promise.all([
          hasAccessToCourse("write", userId, destinationKey),
          hasAccessToCourse("read", userId, firstSourceKey),
        ]).then((results) => results.every(Boolean)),
    };

  return transferStrategies[transferType]
    ? await transferStrategies[transferType]()
    : false;
};

// Helper functions to check access to course and user drives
async function hasAccessToCourse(
  type: "read" | "write",
  userId: string,
  url?: string,
): Promise<boolean> {
  const layerId = url && getValueAfterSegment({ url, segment: "layer" });
  return (
    (layerId &&
      (await hasRolesWithAccess({
        userId,
        layerIds: [layerId],
        rolesWithAccess: [
          "moderator",
          "admin",
          "educator",
          ...(type === "read" ? ["member" as any] : []),
        ],
      }))) ||
    false
  );
}

async function hasAccessToUserDrive(
  userId: string,
  institutionId: string,
  url?: string,
): Promise<boolean> {
  return (
    (url &&
      (await hasRolesWithAccess({
        userId,
        layerIds: [institutionId],
        rolesWithAccess: ["moderator", "admin", "educator", "member"],
      })) &&
      userId === getValueAfterSegment({ url, segment: "user" })) ||
    false
  );
}
