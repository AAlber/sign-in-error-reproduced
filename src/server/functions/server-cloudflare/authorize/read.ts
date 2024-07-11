import type {
  AuthHandInData,
  AuthInstitutionData,
  AuthLayerData,
  AuthUserData,
} from "@/src/types/storage.types";
import { log } from "@/src/utils/logger/logger";
import { hasRolesWithAccess, isAdmin } from "../../server-role";
import {
  extractDataFromUrl,
  getUploadTypeBasedOnKey,
} from "../data-extraction";

// Perform authorization check for read operations based on type and extracted data
export const authorizeReadRequest = async ({
  userId,
  institutionId,
  key,
}: {
  key: string;
  userId: string;
  institutionId: string;
}): Promise<boolean> => {
  const type = getUploadTypeBasedOnKey(key);
  const data = extractDataFromUrl(key, type);

  log.info("Read authorization data", { data, userId, institutionId }).cli();
  const strategy = {
    logo: () => true, // Logos are public in most scenarios
    handIn: async () => handleHandInAuthorization(data, userId),
    public: () => true, // Public files are accessible to everyone
    workbench: async () => handleLayerBasedAuthorization(data, userId),
    layer: async () => handleLayerBasedAuthorization(data, userId),
    "course-drive": async () => handleLayerBasedAuthorization(data, userId),
    block: async () => handleLayerBasedAuthorization(data, userId),
    institution: async () =>
      handleInstitutionAuthorization(data, userId, institutionId),
    "user-drive": async () => handleUserDriveAuthorization(data, userId),
    "user-documents": async () =>
      handleUserDocumentsAuthorization(data, userId),
  };
  const func = data.type && strategy[data.type]; // Local variable to hold the strategy function
  if (func && typeof func === "function") {
    const result = await func(); // Now it's safe to call
    log.info("Read authorization result", { result }).cli();
    return result ? true : false;
  } else {
    log.error("Read authorization function not found").cli();
    return false; // Safe default if function is not available
  }
};

// Handle authorization for hand-in documents
const handleHandInAuthorization = async (data: AuthHandInData, userId) => {
  return (
    data.layerId &&
    ((data.userId && data.userId === userId) ||
      (await checkAccessForRoles(data.layerId, userId, [
        "moderator",
        "admin",
        "educator",
      ])))
  );
};

// Handle authorizations that depend on layer access
const handleLayerBasedAuthorization = async (
  data: AuthLayerData,
  userId: string,
) => {
  return (
    data.layerId &&
    (await checkAccessForRoles(data.layerId, userId, [
      "moderator",
      "admin",
      "educator",
      "member",
    ]))
  );
};

// Handle authorizations for institution-wide resources
const handleInstitutionAuthorization = async (
  data: AuthInstitutionData,
  userId: string,
  institutionId: string,
) => {
  return (
    data.institutionId === institutionId &&
    (await isAdmin({ userId, institutionId }))
  );
};

// Handle authorizations for user drive
const handleUserDriveAuthorization = async (
  data: AuthUserData,
  userId: string,
) => {
  return data.userId === userId;
};

// Check role-based access
const checkAccessForRoles = async (
  layerId: string,
  userId: string,
  roles: Role[],
) => {
  return await hasRolesWithAccess({
    layerIds: [layerId],
    userId,
    rolesWithAccess: roles,
  });
};

export const handleUserDocumentsAuthorization = async (
  data: AuthUserData,
  userId: string,
) => {
  if (!data.institutionId) return false;
  return await isAdmin({ userId, institutionId: data.institutionId });
};
