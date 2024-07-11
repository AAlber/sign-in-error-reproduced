import { Folder } from "lucide-react";
import { memo, useMemo } from "react";
import type { INode } from "react-accessible-treeview";
import {
  useDrive,
  useDynamicDrive,
} from "@/src/client-functions/client-cloudflare/hooks";
import classNames from "@/src/client-functions/client-utils";
import TruncateHover from "../../reusable/truncate-hover";
import { ExpandIcon } from "./expand-or-progress-icon";
import { FlexibleFileIcon } from "./flexible-file-icon";
import RenameDirectoryInput from "./rename-directory-input";

export interface DriveTreeItemProps {
  isExpanded: boolean;
  level: number;
  element: INode<any>;
}
const FileIconsAndName = memo(function FileIconsAndName({
  element,
  isExpanded,
  level,
}: DriveTreeItemProps) {
  const { idBeingRenamed, idsBeingUploaded } = useDynamicDrive();
  const drive = useDrive();
  const currentDirectory = useMemo(
    () => drive.client.get.directory(element),
    [drive.client.get, element],
  );
  const isFolder = currentDirectory?.type === "folder";
  const isBeingRenamed = idBeingRenamed === element.id;
  const isIdBeingUploaded = idsBeingUploaded.includes(element.id as string);

  return (
    <div
      style={{
        minWidth: 300 - 15 * (level - 1),
        ...(isBeingRenamed
          ? {
              width: "100%",
            }
          : {}),
      }}
      className={classNames("flex items-center gap-0.5 text-sm")}
    >
      <ExpandIcon
        isOpen={isExpanded}
        isFolder={isFolder}
        name={element.name}
        isBeingUploaded={isIdBeingUploaded}
      />
      <div className="flex items-center gap-1">
        {isFolder ? (
          <Folder className="size-4" />
        ) : (
          <FlexibleFileIcon fileName={element.name} />
        )}
        {idBeingRenamed === element.id ? (
          <RenameDirectoryInput element={element} />
        ) : (
          <div className="break-all">
            <TruncateHover text={element.name} truncateAt={25} />
          </div>
        )}
      </div>
    </div>
  );
});
export default FileIconsAndName;
