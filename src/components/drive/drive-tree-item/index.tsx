import { type Dispatch, useEffect, useMemo } from "react";
import type {
  EventCallback,
  IBranchProps,
  INode,
  ITreeViewState,
  LeafProps,
  TreeViewAction,
} from "react-accessible-treeview";
import type { IFlatMetadata } from "react-accessible-treeview/dist/TreeView/utils";
import {
  useDrive,
  useDynamicDrive,
} from "@/src/client-functions/client-cloudflare/hooks";
import classNames from "@/src/client-functions/client-utils";
import { arraysContainSameItems } from "@/src/utils/utils";
import DriveContextMenu from "../drive-context-menu";
import DirectoryInfo from "./directory-info";
import DriveItemDndWrapper from "./drive-item-dnd-wrapper";
import FileIconsAndName from "./file-icons-and-name";

export interface DriveTreeItemProps {
  isBranch: boolean;
  isExpanded: boolean;
  level: number;
  element: INode<any>;
  isSelected: boolean;
  handleExpand: EventCallback;
  handleSelect: EventCallback;
  getNodeProps: (
    args?:
      | {
          onClick?: EventCallback | undefined;
        }
      | undefined,
  ) => IBranchProps | LeafProps;
  dispatch: Dispatch<TreeViewAction>;
  treeState: ITreeViewState;
  treeData: INode<IFlatMetadata>[];
}

//TODO: Fix translation for folder and file type
const DriveTreeItem = function DriveTreeItem(props: DriveTreeItemProps) {
  const {
    element,
    isExpanded,
    level,
    isSelected,
    handleExpand,
    handleSelect,
    getNodeProps,
    dispatch,
    treeState,
  } = props;
  const {
    idBeingRenamed,
    selectedIds,
    setSelectedIds,
    folderBeingDraggedOver,
    currentlyDragging,
    setExpandedIds,
  } = useDynamicDrive();
  const drive = useDrive();
  useEffect(() => {
    if (!treeState.selectedIds) return;
    const newSelectedIds = Array.from(treeState.selectedIds).map(String);
    if (!arraysContainSameItems(newSelectedIds, selectedIds)) {
      setSelectedIds(newSelectedIds);
    }
  }, [treeState.selectedIds]);

  useEffect(() => {
    if (!treeState.expandedIds) return;
    const newSelectedIds = Array.from(treeState.expandedIds).map(String);
    if (!arraysContainSameItems(newSelectedIds, selectedIds)) {
      setExpandedIds(newSelectedIds);
    }
  }, [treeState.expandedIds]);

  const memoizedComponent = useMemo(() => {
    return (
      <DriveItemDndWrapper {...props}>
        <DriveContextMenu
          element={element}
          treeState={treeState}
          handleExpand={handleExpand}
          handleSelect={handleSelect}
          dispatch={dispatch}
        >
          <div
            {...getNodeProps()}
            style={{
              paddingLeft: 15 * (level - 1),
            }}
            onKeyDown={(event) => {
              if (idBeingRenamed !== "" && event.key !== "Escape") {
                event.stopPropagation();
              }
            }}
            onDoubleClick={(e) =>
              drive.client.handle.doubleClickOnDirectory(element)
            }
            className={classNames(
              isSelected ||
                (currentlyDragging !== "" &&
                  selectedIds.includes(element.id as string))
                ? "!bg-muted"
                : "",
              folderBeingDraggedOver === element.id ? "!bg-primary" : "",
              "flex h-6 w-full justify-between overflow-hidden rounded-md",
            )}
          >
            <FileIconsAndName
              element={element}
              isExpanded={isExpanded}
              level={level}
            />
            <DirectoryInfo element={element} />
          </div>
        </DriveContextMenu>
      </DriveItemDndWrapper>
    );
  }, [
    props,
    element,
    treeState,
    handleExpand,
    handleSelect,
    dispatch,
    idBeingRenamed,
    drive.client.handle,
    isSelected,
    currentlyDragging,
    selectedIds,
    folderBeingDraggedOver,
    level,
  ]);

  return memoizedComponent;
};
export default DriveTreeItem;
