import type { DriveAPIOperations } from "./drive-backend-operations";
import type { DriveInteractionOperations } from "./drive-interaction-operations";
import type { DriveStateOperations } from "./drive-state-operations";
import type { DriveTreeOperations } from "./drive-tree-operations";
import type { DriveUtilOperations } from "./drive-util-operations";

/**
 * The handler responsible for managing storage operations,
 * including file uploads, directory manipulations, and utility functions.
 */
export class DriveHandler {
  constructor(
    private readonly _backend: DriveAPIOperations,
    private readonly _interaction: DriveInteractionOperations,
    private readonly _utils: DriveUtilOperations,
    private readonly _tree: DriveTreeOperations,
    private readonly _state: DriveStateOperations,
  ) {}
  // Operations for managing files and directories in storage
  api = {
    /**
     * Saves a new folder in the drive to cloudflare as well as to the zustand state.
     * @param {INode<any>} element - The tree node representing the folder to be saved.
     * @param {string} directoryName - The name of the new directory.
     */
    saveNewFolder: this._backend.saveNewFolder.bind(this._backend),
    /**
     * Saves changes when a folder is renamed to cloudflare as well as to the zustand state.
     * @param {INode<any>} element - The tree node representing the folder being renamed.
     * @param {string} directoryName - The new name for the directory.
     */
    saveRenamedFolder: this._backend.saveRenamedFolder.bind(this._backend),

    /**
     * Lists files within a directory.
     * @param {FileUploadPathData} data - The data required to list files in a specific directory path.
     * @returns {Promise<any>} The list of files within the directory.
     */
    listFilesInDrive: this._backend.listFilesInDrive.bind(this._backend),

    /**
     * Gets the storage categories for the current drive
     * @returns {StorageCategory[]} The storage categories for the drive.
     */
    getStorageCategories: this._backend.getStorageCategories.bind(
      this._backend,
    ),
  };

  utils = {
    /**
     * Removes the last segment from a given path.
     * @param {string} path - The full path from which to remove the last segment.
     * @returns {string} The path without the last segment.
     */
    removeLastSegment: this._utils.removeLastSegment.bind(this._utils),

    /**
     * Retrieves the sub-path from a full path based on a base path.
     * @param {string} path - The full path.
     * @param {string} [fromPath] - The base path to calculate the sub-path from. Optional.
     * @returns {string} The sub-path.
     */
    getSubPath: this._utils.getSubPath.bind(this._utils),

    /**
     * Expands a treeview element based on its ID.
     * @param {string} elementId - The ID of the element to expand.
     * @param {Dispatch<TreeViewAction>} dispatch - The dispatch function to trigger tree actions.
     */
    expandElement: this._utils.expandElement.bind(this._utils),

    /**
     * Provides a default name for a directory that is being renamed.
     * @param {DirectoryListResult} [directory] - The directory being renamed. Optional.
     * @returns {string} The default name for renaming.
     */
    getDefaultNameForRenaming: this._utils.getDefaultNameForRenaming.bind(
      this._utils,
    ),

    /**
     * Gets the base path for the current drive.
     * @returns {string} The base path of the drive.
     */
    getBasePath: this._utils.getBasePath.bind(this._utils),
  };

  client = {
    handle: {
      /**
       * Handles the drop action for files or folders within the drive UI.
       * @param {React.DragEvent<HTMLDivElement>} event - The drag event containing the dropped items.
       */
      drop: this._interaction.handleDrop.bind(this._interaction),

      /**
       * Handles the drop action within a specific subfolder.
       * @param {{ e: React.DragEvent<HTMLDivElement>; setIsCurrentElementBeingDraggedOver: (b: boolean) => void; }} params - The parameters including the event and a setter function to update UI state.
       */
      dropInSubfolder: this._interaction.handleDropInSubfolder.bind(
        this._interaction,
      ),

      /**
       * Handles the paste action within a directory.
       * @param { ClipboardEvent } event - The paste Event.
       */
      paste: this._interaction.handlePaste.bind(this._interaction),

      /**
       * Handles the copy action within a directory.
       * @param { ClipboardEvent } event - The copy Event.
       */
      copy: this._interaction.handleCopy.bind(this._interaction),

      /**
       * Handles a double-click action on a directory, potentially opening it or downloading its contents.
       * @param {INode<any>} element - The tree node representing the directory.
       * @param {(id: string) => void} setOpenedFolderId - Setter function to update the state with the opened directory's ID.
       */
      doubleClickOnDirectory:
        this._interaction.handleDoubleClickOnDirectory.bind(this._interaction),

      /**
       * Handles the event when a draggable element leaves the drive.
       * @param {React.DragEvent<HTMLDivElement>} e - The drag event.
       */
      dragLeave: this._interaction.handleDragLeave.bind(this._interaction),

      /**
       * Handles the event when a draggable element is over the drive.
       * @param {React.DragEvent<HTMLDivElement>} e - The drag event.
       */
      dragOver: this._interaction.handleDragOver.bind(this._interaction),
    },
    create: {
      /**
       * Creates a dummy directory within a specified parent folder. This is used as a placeholder for a new subfolder being named by the user.
       * @param {string} parentId - The ID of the parent folder where the dummy subfolder will be created.
       * @param {DataFile} [file] - Optional. A data file to add to the dummy subfolder.
       * @returns {DirectoryListResult[]} The updated array of directory list results, including the new dummy subfolder.
       */
      dummySubdirectory: this._state.addDummySubDirectory.bind(this._state),
    },
    get: {
      /**
       * Retrieves a flattened array representation of the tree structure, useful for rendering.
       * @returns {INode[]} An array of nodes representing the flattened tree.
       */
      flattenedTree: this._tree.getFlattenedTree.bind(this._tree),
      /**
       * Finds a directory by its ID within the tree structure.
       * @param {string} id - The ID of the directory to find.
       * @returns {DirectoryListResult | undefined} The found directory, or undefined if no directory matches the ID.
       */
      directory: this._state.getDirectory.bind(this._state),

      /**
       * Retrieves the size of a category from zustand
       * @param {string} categoryTitle - The title of the category to retrieve the size for.
       * @returns {number | undefined} The size of the category, or undefined if the category does not exist.
       */
      storageCategorySize: this._state.getStorageCategorySize.bind(this._state),

      /**
       * Retrieves the directories that are selected for deletion.
       * @param {DirectoryListResult[]} foldersAndFiles - The current array of directories and files.
       * @param {string[]} selectedIds - The IDs of the selected directories or files.
       * @returns {DirectoryListResult[]}
       */
      deletionDirectories: this._state.getDeletionDirectories.bind(this._state),

      /**
       * Checks if the user has write access in a drive.
       * @returns {boolean} True if the user has write access, false otherwise.
       */
      hasWriteAccess: this._utils.hasWriteAccess.bind(this._utils),
    },

    update: {
      /**
       * Updates the storage statuses of the drive
       * @param {StorageCategory[]} storageCategories - The storage categories to update.
       *
       */
      storageCategory: this._state.updateStorageCategory.bind(this._state),
      /**
       * Sets the ID of the deepest folder that has been navigated to, which is used for tracking the current state of < > navigation within the drive.
       * @param {string} id - The ID of the deepest folder that has been navigated to.
       */
      deepestFolderId: this._state.setNewDeepestFolderId.bind(this._state),
    },

    confirm: {
      /**
       * Confirms the deletion of a directory or file.
       * @param {INode<any>} element - The tree node representing the directory or file to be deleted.
       * @param {string[]} selectedIds - The IDs of the selected directories or files to be deleted.
       */
      deleteDirectory: this._backend.confirmDeleteDirectory.bind(this._backend),
    },
  };
}
