import { authorizeFileTransfer } from "./authorize/file-transfer";
import { authorizeReadRequest } from "./authorize/read";
import { authorizeCloudflareWrite } from "./authorize/write";
import { storageOperations } from "./blob-storage/storage-operations";
import { createListFilesPath, createUploadPath } from "./path-generation";
import { sharedStorageOperations } from "./shared-storage-operations";

/**
 * Class responsible for managing all storage operations and authorizations.
 */
export class StorageHandler {
  /**
   * Contains methods and properties that directly interact with storage operations.
   * @private
   */
  private readonly r2Ops = storageOperations;
  private sharedOps = sharedStorageOperations;
  /**
   * Object containing methods for authorization checks.
   * @property {Function} write - Authorizes write operations.
   * @property {Function} read - Authorizes read operations.
   * @property {Function} fileTransfer - Authorizes file transfers.
   */
  authorize = {
    write: authorizeCloudflareWrite,
    read: authorizeReadRequest,
    fileTransfer: authorizeFileTransfer,
  };

  create = {
    /**
     * Creates a path used to list files from specific types of storage areas, such as user drives or course drives.
     * The path construction depends on the provided type and includes institution and user identifiers where applicable.
     *
     * @param {FileUploadPathData} data - Contains data necessary for constructing the path, including any subpath and the type of storage area.
     * @param {string | null} institutionId - The institution identifier to be included in the path.
     * @param {string | null} userId - The user identifier, important for paths that are user-specific.
     * @returns {string} The constructed path from which files can be listed.
     * @throws {Error} Throws an error if the provided type is invalid or unsupported for list operations.
     */
    listPath: createListFilesPath,
    /**
     * Generates a storage path for file uploads based on the type of upload and associated data.
     * This path includes directory segments that correspond to the institution, user, and specific file attributes.
     *
     * @param {UploadPathDataWithFile} data - Contains the filename, subpath, and specific attributes like layerId and blockId for constructing the path.
     * @param {string | null} institutionId - The institution identifier to be included in the path.
     * @param {string | null} userId - The user identifier to be included in the path, relevant for user-specific storage areas.
     * @returns {string} The fully constructed path suitable for uploading files to the designated storage location.
     */
    uploadPath: createUploadPath,
  };

  /**
   * Provides methods for retrieving files and related URLs from storage.
   */
  get = {
    /**
     * Returns a signed URL for securely accessing a specific file.
     * @param {string} key - The unique identifier for the file.
     * @param {Object} options - Options for signing the URL.
     * @returns {Promise<string>} A promise that resolves to the signed URL.
     */
    signedGetUrl: this.r2Ops.getFileSignedUrl.bind(this.r2Ops),

    /**
     * Returns a signed URL for securely uploading a file to storage.
     * @param {string} key - The unique identifier for the file.
     * @param {Object} options - Options for signing the URL.
     * @returns {Promise<string>} A promise that resolves to the signed URL.
     */
    signedPutUrl: this.r2Ops.putFileSignedUrl.bind(this.r2Ops),

    /**
     * Retrieves a file from storage based on the provided key.
     * @param {string} key - The unique identifier for the file.
     * @returns {Promise<Object>} A promise that resolves to the file data.
     */
    file: this.r2Ops.getFile.bind(this.r2Ops),

    /**
     * Retrieves the current storage status for a given institution.
     * @param {string} institutionId - The unique identifier for the institution.
     * @returns {Promise<Object>} A promise that resolves to the storage status information.
     */
    storageStatus: this.sharedOps.getInstitutionStorageStatus.bind(
      this.sharedOps,
    ),

    /**
     * Retrieves the storage size for a given key.
     * @param {string}
     * @returns {Promise<Object>} A promise that resolves to the storage size for the key.
     *
     */
    storageSize: this.sharedOps.getStorageSize.bind(this.sharedOps),

    /**
     * Retrieves the storage categories for a given key.
     * @param {string}
     * @returns {Promise<Object>} A promise that resolves to the storage categories for the key.
     */
    storageCategories: this.sharedOps.getStorageCategories.bind(this.sharedOps),
  };

  /**
   * Contains methods for listing various storage entities.
   */
  list = {
    /**
     * Lists all objects at a given storage path, potentially after removing the last path segment.
     * @param {string} path - The storage path from which objects will be listed.
     * @returns {Promise<Array>} A promise that resolves to an array of storage objects.
     */
    r2Objects: this.sharedOps.listR2Objects.bind(this.sharedOps),

    // /**
    //  * Lists objects within a user's drive, applying reductions and filters.
    //  * @param {string} path - The storage path specific to a user's drive.
    //  * @param {Object} options - Options to control filtering and reduction of the listed objects.
    //  * @returns {Promise<Array>} A promise that resolves to an array of filtered/reduced storage objects.
    //  */
    // reducedR2Objects: this.r2Ops.listReducedR2Objects.bind(this.r2Ops),

    /**
     * Provides a comprehensive overview of storage usage across different layers within an institution.
     * @param {string} institutionId - The unique identifier for the institution.
     * @returns {Promise<Object>} A promise that resolves to the overview of storage sizes per layer.
     */
    layerSizes: this.sharedOps.listLayerSizes.bind(this.sharedOps),
  };

  /**
   * Contains methods for deleting files and folders.
   */
  delete = {
    /**
     * Deletes a specific file from storage.
     * @param {string} key - The unique identifier for the file to be deleted.
     * @returns {Promise<boolean>} A promise that resolves to true if the file was successfully deleted.
     */
    file: this.sharedOps.deleteFile.bind(this.sharedOps),

    /**
     * Deletes a folder and all its contents from storage.
     * @param {string} path - The path to the folder to be deleted.
     * @returns {Promise<boolean>} A promise that resolves to true if the folder was successfully deleted.
     */
    folder: this.sharedOps.deleteFolder.bind(this.sharedOps),

    /**
     * Asynchronously deletes a list of directories and/or files specified in the provided data.
     * Each item in the data array is checked to determine if it is a folder or a file,
     * and the appropriate deletion method is called accordingly.
     *
     * @param {DeleteMultipleDirectoriesData} data - An array of objects where each object contains the URL of the file or folder
     *                                        and a boolean indicating whether it is a folder.
     * @returns {Promise<Array<boolean>>} A promise that resolves to an array of booleans, where each boolean represents
     *                                    the success of the delete operation for the corresponding file or folder.
     * @example
     * const deleteData = [
     *   { url: 'path/to/folder', isFolder: true },
     *   { url: 'path/to/file.txt', isFolder: false }
     * ];
     * storageHandler.deleteDirectories(deleteData).then(results => {
     *   console.log(results); // [true, true] if both operations succeed
     * });
     */
    multipleDirectories: this.sharedOps.deleteDirectories.bind(this.sharedOps),
  };

  /**
   * Contains methods for copying or moving files within the storage.
   */
  copy = {
    /**
     * Moves files from one location to another within storage, effectively serving as a copy operation.
     * @param {string} source - The source path from where the files will be moved.
     * @param {string} destination - The destination path to where the files will be moved.
     * @param {Object} options - Options that may affect the copying process.
     * @returns {Promise<boolean>} A promise that resolves to true if the files were successfully moved.
     */
    files: this.sharedOps.moveFiles.bind(this.sharedOps),
  };
}

export const storageHandler = new StorageHandler();
