import { getKeyFromUrl } from "@/src/client-functions/client-cloudflare/utils";
import type {
  AuthBaseData,
  AuthData,
  AuthHandInData,
  AuthInstitutionData,
  AuthLayerData,
  AuthorizationParams,
  AuthSubPathData,
  AuthUserData,
} from "@/src/types/storage.types";
import { log } from "@/src/utils/logger/logger";
import { hasRolesWithAccess, isAdmin } from "../../server-role";
import {
  extractDataFromUrl,
  getUploadTypeBasedOnKey,
} from "../data-extraction";

/**
 * Performs authorization checks based on type and data.
 */
export const writeAuthCheck = async (
  data: AuthData,
  userId: string,
  institutionId?: string,
): Promise<boolean> => {
  const strategy: { [key: string]: () => Promise<boolean> } = {
    logo: async () => handleLogoAuthorization(data, userId, institutionId),
    handIn: async () => handleHandInAuthorization(data, userId),
    public: async () => handlePublicAuthorization(data, userId),
    // More strategies
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

  // Ensure the function exists before calling it
  const func = data.type && strategy[data.type]; // Local variable to hold the strategy function
  if (func && typeof func === "function") {
    return await func(); // Now it's safe to call
  } else {
    return false; // Safe default if function is not available
  }
};

/**
 * Authorizes write operations for a list of parameters.
 */
export const authorizeCloudflareWrite = async ({
  urls,
  userId,
  institutionId,
}: AuthorizationParams): Promise<boolean> => {
  log
    .info("Cloudflare Write Authorization params", {
      urls,
      userId,
      institutionId,
    })
    .cli();

  const dataFromUrls = urls.map((url) => {
    const key = getKeyFromUrl(url);
    const type = getUploadTypeBasedOnKey(key);
    const data = extractDataFromUrl(url, type);
    return data;
  });

  log.info("data", dataFromUrls);

  if (!areAllObjectsIdentical(dataFromUrls)) return false;

  const result = dataFromUrls[0]
    ? await writeAuthCheck(dataFromUrls[0], userId, institutionId)
    : false;
  log.info("Write Auth result", result).cli();
  return result;
};

function areAllObjectsIdentical(objectsArray: AuthData[]) {
  // Convert the first object to a JSON string to use as a reference
  const objectsWithoutSubPath = objectsArray.map((obj) => {
    if ("subPath" in obj) {
      const { subPath, ...rest } = obj;
      return rest;
    } else return obj;
  });
  const reference = JSON.stringify(objectsWithoutSubPath[0]);

  // Check every object against the reference
  const result = objectsWithoutSubPath.every(
    (obj) => JSON.stringify(obj) === reference,
  );
  log.info("Are all objects identical?", { result, reference }).cli();
  return result;
}

const handleLogoAuthorization = async (
  data: AuthBaseData,
  userId: string,
  institutionId?: string,
): Promise<boolean> => {
  log.info("Logo Authorization", { data, userId, institutionId }).cli();
  return (
    !!institutionId &&
    data.type === "logo" &&
    (await isAdmin({ userId, institutionId }))
  );
};
// Helper functions to handle different authorization strategies
const handleHandInAuthorization = async (
  data: AuthHandInData,
  userId: string,
): Promise<boolean> => {
  log.info("HandIn Authorization", { data, userId }).cli();
  return (
    !!data.layerId &&
    (data.userId === userId ||
      (await checkAccessForRoles(data.layerId, userId, [
        "moderator",
        "admin",
        "educator",
      ])))
  );
};

const handlePublicAuthorization = async (
  data: AuthSubPathData,
  userId,
): Promise<boolean> => {
  const layerId = data.subPath?.split("/")[1];
  if (!layerId) return false; // Will have to become more flexible in the future
  log.info("Public Authorization", { data, userId, layerId }).cli();
  return await checkAccessForRoles(layerId, userId, [
    "moderator",
    "admin",
    "educator",
  ]);
};

const handleLayerBasedAuthorization = async (
  data: AuthLayerData,
  userId: string,
): Promise<boolean> => {
  log.info("Layer Based Authorization", { data, userId }).cli();
  if (!data.layerId) return false;
  return await checkAccessForRoles(data.layerId, userId, [
    "moderator",
    "admin",
    "educator",
  ]);
};

const handleInstitutionAuthorization = async (
  data: AuthInstitutionData,
  userId: string,
  institutionId,
): Promise<boolean> => {
  log.info("Institution Authorization", { data, userId, institutionId }).cli();
  return (
    data.institutionId === institutionId &&
    (await isAdmin({ userId, institutionId }))
  );
};

const handleUserDriveAuthorization = async (
  data: AuthUserData,
  userId,
): Promise<boolean> => {
  log.info("User Drive Authorization", { data, userId }).cli();
  return data.userId === userId;
};

const checkAccessForRoles = async (
  layerId: string,
  userId: string,
  roles: Role[],
): Promise<boolean> => {
  log.info("Check Access For Roles", { layerId, userId, roles }).cli();
  return await hasRolesWithAccess({
    layerIds: [layerId],
    userId,
    rolesWithAccess: roles,
  });
};

const handleUserDocumentsAuthorization = async (
  data: AuthUserData,
  userId: string,
): Promise<boolean> => {
  log.info("User Documents Authorization", { data, userId }).cli();
  if (!data.institutionId) return false;
  return await isAdmin({ institutionId: data.institutionId, userId });
};
