import mime from "mime";
import { flattenTree } from "react-accessible-treeview";
import type { DriveZustand } from "@/src/components/drive/zustand";
import type {
  DataFile,
  DriveTreeNode,
  Folder,
  ProcessR2ObjectParams,
  ReducedR2Object,
  SharedProperties,
} from "@/src/types/storage.types";
import { filterUndefined } from "@/src/utils/utils";
import { getBasicDirectoryInfo } from "../client-cloudflare/utils";
import { filterUndefinedInArray } from "../client-utils";
import type { DriveUtilOperations } from "./drive-util-operations";

/** Non-async state operations related to the Layer tree thats creates the administration structure */
export class DriveTreeOperations {
  constructor(
    private readonly zustand: () => DriveZustand,
    private readonly _utils: DriveUtilOperations,
  ) {}

  getFlattenedTree = () => {
    const { openedFolderId, r2Objects } = this.zustand();

    const isCurrentlyInSubfolder = openedFolderId !== "";
    const objects = isCurrentlyInSubfolder
      ? r2Objects.filter((obj) => obj.Key.startsWith(openedFolderId))
      : r2Objects;

    let treeNodes = this.buildTree(this._utils.getBasePath(), objects);
    const folder = this.findDirectoryById(treeNodes, openedFolderId);
    if (isCurrentlyInSubfolder && folder && "children" in folder) {
      treeNodes = folder.children;
    }

    try {
      const tree = {
        name: "root",
        children: treeNodes ? filterUndefinedInArray(treeNodes) : [],
      };
      const flattenedTree = flattenTree(tree);
      return flattenedTree;
    } catch (e) {
      console.error(e);
    }
  };

  findDirectoryById(
    items: DriveTreeNode[],
    id?: string,
  ): DriveTreeNode | undefined {
    if (!id) return undefined;
    for (const item of items) {
      if (item.id === id) {
        return item;
      }
      if ("children" in item && item.children) {
        const child = this.findDirectoryById(item.children, id);
        if (child) {
          return child;
        }
      }
    }
    return undefined;
  }

  // // Run recursive getFoldersWithFiles function to get all folders and their files

  private buildTree(
    key: string,
    fileObjects: ReducedR2Object[],
  ): DriveTreeNode[] {
    const files: DataFile[] = [];
    const folders: Folder[] = [];
    fileObjects.map((currentObject) =>
      this.processR2Object({ fileObjects, currentObject, folders, files, key }),
    );
    const updatedFolders = this._utils.aggregateFolderData(folders);
    for (const folder of updatedFolders) {
      if (folder.objects)
        folder.children = this.buildTree(
          folder.id,
          folder.objects
            .map((obj) => {
              return {
                Key: obj.Key || "",
                Size: obj.Size || 0,
                LastModified: obj.LastModified || new Date(),
              };
            })
            .filter(filterUndefined),
        );
    }
    return this._utils.removeObjectsProperty([...updatedFolders, ...files]);
  }

  private processR2Object = (params: ProcessR2ObjectParams) => {
    const { currentObject, key, files, folders } = params;
    const { directoryName, isFolder } = getBasicDirectoryInfo(
      currentObject.Key ?? "",
      key,
    );
    const sharedProperties: SharedProperties = {
      id: key + "/" + directoryName,
      size: currentObject.Size || 0,
      lastModified: new Date(currentObject.LastModified || 0),
      name: decodeURIComponent(directoryName),
    };
    if (isFolder) {
      folders.push({
        ...sharedProperties,
        type: "folder",
        objects: [currentObject],
        children: [],
      });
    } else {
      files.push({
        ...sharedProperties,
        type: mime.getType(directoryName) || "file",
      });
    }
  };
}
