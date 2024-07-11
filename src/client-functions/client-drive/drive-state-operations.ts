import cuid from "cuid";
import dayjs from "dayjs";
import mime from "mime";
import prettyBytes from "pretty-bytes";
import type { INode } from "react-accessible-treeview";
import type { DriveZustand } from "@/src/components/drive/zustand";
import type { ReducedR2Object } from "@/src/types/storage.types";
import { filterUndefined } from "@/src/utils/utils";
import {
  getFileName,
  getStringBeforeLastSlash,
  mimeTypeToHumanReadable,
} from "../client-cloudflare/utils";
import { capitalizeFirstLetter, removeDuplicates } from "../client-utils";
import type { DriveUtilOperations } from "./drive-util-operations";

export class DriveStateOperations {
  constructor(
    private readonly zustand: () => DriveZustand,
    private readonly _utils: DriveUtilOperations,
  ) {}

  updateStorageCategory = ({
    categoryTitle,
    newValue,
  }: {
    categoryTitle: string;
    newValue: number;
  }) => {
    const { storageCategories, setStorageCategories } = this.zustand();
    if (storageCategories) {
      const newCategories = storageCategories.map(
        (category) =>
          category.title === categoryTitle
            ? { ...category, size: newValue } // Update size for the matching category
            : category, // Keep other categories unchanged
      );
      setStorageCategories(newCategories);
    }
  };

  getStorageCategorySize = (categoryTitle: string) => {
    const { storageCategories } = this.zustand();
    return storageCategories?.find(
      (category) => category.title === categoryTitle,
    )?.size;
  };

  getDeletionDirectories = (element?: INode<any>) => {
    const { selectedIds } = this.zustand();
    const currentId = element?.id as string;
    let directories = [...selectedIds, currentId]
      .filter((id) => {
        const directory = this.getDirectoryById(id);
        return directory?.name !== "EmptyGq5GaeYoyabHtCGf.txt";
      })
      .filter(filterUndefined);
    directories = removeDuplicates(directories);
    return {
      directories: directories
        .map((id) => {
          return this.getDirectoryById(id)?.name;
        })
        .join(", "),
    };
  };

  newUpdateDirectory = (
    objects: ReducedR2Object[],
    id: string,
    data: Partial<ReducedR2Object>,
  ): ReducedR2Object[] => {
    return objects.map((object) => {
      if (object.Key === id) {
        return { ...object, ...data };
      }
      return object;
    });
  };

  findR2ObjectById = (
    items: ReducedR2Object[],
    id: string,
  ): ReducedR2Object | undefined => {
    return items.find((item) => item.Key === id);
  };

  getDirectory = (element: INode<any>) => {
    return this.getDirectoryById(element.id as string);
  };

  getDirectoryById = (elementId: string) => {
    const { r2Objects } = this.zustand();
    const obj = this.findR2ObjectById(r2Objects, elementId);
    return this.reformatR2Object({ obj, id: elementId });
  };

  getFolderSize = (elementId: string) => {
    const { r2Objects } = this.zustand();
    const obj = this.findAllChildIds({ id: elementId });
    let totalSize = 0;
    obj.forEach((id) => {
      const file = this.findR2ObjectById(r2Objects, id);
      totalSize += file?.Size || 0;
    });
    if (!this._utils.hasNonEmptyLeaf(elementId)) return 0;
    return totalSize;
  };

  removeDirectory = (id: string): ReducedR2Object[] => {
    const { r2Objects } = this.zustand();
    return r2Objects.filter(
      (item) => item.Key !== id && !item.Key.includes(id),
    );
  };

  addDummySubDirectory = (
    parentId: string,
    file?: ReducedR2Object,
  ): ReducedR2Object[] => {
    const { setR2Objects, r2Objects } = this.zustand();
    const dummyFolder = this.createNewDummyFolder(parentId);
    const result = [...r2Objects, file ?? dummyFolder];
    setR2Objects(result);
    this.setRenameIdIfNecessary(dummyFolder);
    return result;
  };

  findAllChildIds = ({ id }: { id: string }): string[] => {
    const { r2Objects } = this.zustand();
    return r2Objects
      .filter((obj) => obj.Key.startsWith(id))
      .map((obj) => obj.Key);
  };

  setNewDeepestFolderId = (id: string) => {
    const { setDeepestLastFolderId, deepestLastFolderId } = this.zustand();
    const amountOfSubfolderInCurrentDeepest =
      deepestLastFolderId.split("/").length;
    const amountOfSubfoldersInThisId = id.split("/").length;
    const firstPartOfOldSubPath = this._utils
      .getSubPath(deepestLastFolderId)
      .split("/")[0];
    const firstPartOfNewSubPath = this._utils.getSubPath(id).split("/")[0];
    if (
      amountOfSubfolderInCurrentDeepest < amountOfSubfoldersInThisId &&
      firstPartOfOldSubPath === firstPartOfNewSubPath
    ) {
      setDeepestLastFolderId(id);
    }
    if (firstPartOfNewSubPath !== firstPartOfOldSubPath) {
      setDeepestLastFolderId(id);
    }
  };

  private setRenameIdIfNecessary = (
    folder: ReducedR2Object & { name: string },
  ) => {
    const { setIdBeingRenamed } = this.zustand();
    if (folder.name.startsWith("-new-folder-")) {
      setIdBeingRenamed(getStringBeforeLastSlash(folder.Key));
    }
  };

  private getDummyFolderName = () => {
    const newFolderRandomEnding = cuid();
    return "-new-folder-" + newFolderRandomEnding;
  };

  // Utility function to create a new folder object
  private createNewDummyFolder = (
    parentId: string,
  ): ReducedR2Object & { name: string } => {
    const folderName = this.getDummyFolderName();
    return {
      Key: parentId + "/" + folderName + "/EmptyGq5GaeYoyabHtCGf.txt",
      Size: 0,
      LastModified: new Date(),
      name: folderName,
    };
  };

  private reformatR2Object = ({
    obj,
    id,
  }: {
    obj?: ReducedR2Object;
    id: string;
  }) => {
    const size = obj ? obj.Size : this.getFolderSize(id);
    const lastModified = obj ? obj.LastModified : new Date();
    return {
      name: getFileName(id) || "",
      size: size,
      lastModified,
      sizeText: !this._utils.hasNonEmptyLeaf(id) ? "--" : prettyBytes(size),
      typeText: capitalizeFirstLetter(
        obj
          ? mimeTypeToHumanReadable(mime.getType(obj?.Key || "") || "file")
          : "Folder",
      ),
      type: obj ? mime.getType(obj?.Key || "") || "file" : "folder",
      lastModifiedText: dayjs(lastModified).format("DD. MMM YYYY"),
    };
  };
}
