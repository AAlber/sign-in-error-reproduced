import type { Dispatch } from "react";
import type { INode, TreeViewAction } from "react-accessible-treeview";
import useCourse from "@/src/components/course/zustand";
import type { DriveZustand } from "@/src/components/drive/zustand";
import { useCourseDrive, useUserDrive } from "@/src/components/drive/zustand";
import type {
  DriveTreeNode,
  DriveTypes,
  Folder,
} from "@/src/types/storage.types";
import useUser from "@/src/zustand/user";

/** Non-async state operations related to the Layer tree thats creates the administration structure */
export class DriveUtilOperations {
  constructor(
    private readonly driveType: DriveTypes,
    private readonly zustand: () => DriveZustand,
  ) {}

  getBasePath = () => {
    const { user } = useUser.getState();
    const { course } = useCourse.getState();
    let basePath = "institutions/" + user.currentInstitutionId;
    if (this.driveType === "course-drive") {
      basePath += "/layer/" + course.layer_id + "/course-drive";
    } else {
      basePath += "/user/" + user.id + "/user-drive";
    }
    return basePath;
  };

  getOppositeZustand = () => {
    return this.driveType === "course-drive"
      ? useUserDrive.getState()
      : useCourseDrive.getState();
  };

  getOppositeDriveType = () => {
    return this.driveType === "course-drive" ? "user-drive" : "course-drive";
  };

  extractBasePath(path: string): string {
    // Regular expression for matching the base paths
    const basePathPattern =
      /^(institutions\/[^\/]+\/(layer|user)\/\d+\/(course-drive|user-drive))/;
    const match = path.match(basePathPattern);

    // If the path matches the pattern, return the matched base path, otherwise return an empty string
    return match && match[1] ? match[1] : "";
  }

  hasNonEmptyLeaf(elementId?: string) {
    const { r2Objects } = this.zustand();
    if (!elementId) return false;
    const objects = r2Objects.filter((obj) => obj.Key.startsWith(elementId));
    return !objects.every((obj) =>
      obj.Key.endsWith("/EmptyGq5GaeYoyabHtCGf.txt"),
    );
  }

  getSizeOfDirectory = (directories: DriveTreeNode[]) =>
    directories.reduce((total, child) => total + child.size, 0);

  getSubPath(path: string, fromPath?: string) {
    const pathToFindSubPath = fromPath || this.getBasePath(); //could be circular dep
    let res = path.replace(pathToFindSubPath, "");
    if (res.startsWith("/")) res = res.slice(1);
    while (res.endsWith("/")) res = res.slice(0, -1);
    return res;
  }

  getDefaultNameForRenaming(directory?: INode<any>) {
    const name = directory?.name as string;
    return name.startsWith("-new-folder") ? "" : name;
  }

  sortFoldersByName(objects: DriveTreeNode[]): DriveTreeNode[] {
    return objects.sort((a, b) => a.name.localeCompare(b.name));
  }

  removeLastSegment(path: string) {
    // Split the string into segments
    const segments = path.split("/");

    // Remove the last segment. Note that if the path ends with a '/',
    // the last segment will be an empty string, so we remove the second to last segment in that case.
    if (segments.length > 0 && segments[segments.length - 1] === "") {
      segments.pop(); // Remove the last empty segment due to trailing '/'
    }

    // Remove the now last segment, which is the actual last word before the trailing '/'
    segments.pop();

    // Join the segments back together and ensure it ends with a '/'
    return segments.length > 0 ? `${segments.join("/")}` : "";
  }

  hasWriteAccess = () => {
    const { hasSpecialRole } = useCourse.getState();
    return this.driveType !== "user-drive" && hasSpecialRole;
  };

  expandElement = (elementId: string, dispatch: Dispatch<TreeViewAction>) => {
    dispatch({
      type: "EXPAND",
      id: elementId,
    });
  };

  aggregateFolderData = (folders: Folder[]): Folder[] => {
    const folderSizeMap = new Map<string, Folder>();
    folders.forEach((folder) => {
      if (folderSizeMap.has(folder.name)) {
        const existingFolder = folderSizeMap.get(folder.name)!;
        existingFolder.size += folder.size;
        if (folder.objects) {
          existingFolder.objects?.push(...folder.objects);
        }
        existingFolder.lastModified = this.getLaterTimestamp(
          existingFolder.lastModified,
          folder.lastModified,
        );
        folderSizeMap.set(folder.name, existingFolder);
      } else {
        folderSizeMap.set(folder.name, { ...folder });
      }
    });
    return Array.from(folderSizeMap.values());
  };

  getLaterTimestamp(time1: Date, time2: Date) {
    if (time1 > time2) {
      return time1;
    } else {
      return time2;
    }
  }

  removeObjectsProperty(items: DriveTreeNode[]): DriveTreeNode[] {
    const res = items.map((item) => {
      if ("objects" in item) {
        item.objects = undefined;
      }
      if ("children" in item && Array.isArray(item.children)) {
        item.children = this.removeObjectsProperty(item.children);
      }
      return item;
    });
    return res;
  }
}
