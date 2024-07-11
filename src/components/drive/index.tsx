import { StatusBar } from "@uppy/react";
import dayjs from "dayjs";
import { useCallback, useEffect, useRef, useState } from "react";
import TreeView, { flattenTree } from "react-accessible-treeview";
import {
  useDrive,
  useDriveType,
  useDynamicDrive,
} from "@/src/client-functions/client-cloudflare/hooks";
import classNames from "@/src/client-functions/client-utils";
import useUser from "@/src/zustand/user";
import useCourse from "../course/zustand";
import { useCourseDriveUploader } from "../reusable/file-uploaders/zustand";
import Skeleton from "../skeleton";
import { DriveHeader } from "./drive-header";
import DriveTreeItem from "./drive-tree-item";
import EmptyDrive from "./empty-drive";
import ErrorBoundary from "./error-boundary";

export default function Drive({ className }: { className?: string }) {
  const { user } = useUser();
  dayjs.locale(user.language);
  const { course } = useCourse();
  const {
    loadingFiles,
    selectedIds,
    setIdBeingRenamed,
    expandedIds,
    isDriveBeingDraggedOver,
    openedFolderId,
    r2Objects,
    idsBeingUploaded,
    storageCategories,
    reset,
  } = useDynamicDrive();
  const [flatTree, setFlatTree] = useState(flattenTree([] as any));
  const dragContainerRef = useRef(null);

  const driveType = useDriveType();
  const drive = useDrive();
  useEffect(() => {
    drive.api.listFilesInDrive(
      driveType === "user-drive"
        ? { type: driveType }
        : { type: driveType, layerId: course.layer_id },
      driveType === "course-drive" && r2Objects.length > 0,
    );
  }, [course.layer_id]);

  useEffect(() => {
    return () => {
      reset();
    };
  }, []);

  useEffect(() => {
    if (r2Objects.length > 0) {
      setFlatTree(drive.client.get.flattenedTree() as any);
    }
    if (storageCategories) {
      drive.client.update.storageCategory({
        categoryTitle: "course-drive",
        newValue: r2Objects.reduce((acc, curr) => acc + curr.Size, 0),
      });
    }
  }, [r2Objects, openedFolderId]);

  const handleDragLeave = useCallback(drive.client.handle.dragLeave, []);
  const handleDragOver = useCallback(
    (e) => drive.client.handle.dragOver(e, dragContainerRef),
    [],
  );
  const { uppy } = useCourseDriveUploader();

  return (
    <div className="mx-2 h-full overflow-y-scroll">
      {uppy && (
        <div className="bg-blue !z-40 w-full">
          <StatusBar uppy={uppy} />
        </div>
      )}
      {idsBeingUploaded.length === 0 && <DriveHeader />}
      <div
        ref={dragContainerRef}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            setIdBeingRenamed(
              selectedIds && selectedIds[0] ? selectedIds[0] : "",
            );
          }
        }}
        className={classNames(
          isDriveBeingDraggedOver ? "border-dashed !border-primary" : "",
          "directory flex justify-between overflow-x-hidden overflow-y-scroll rounded-md border border-border bg-foreground p-2",
          className ?? "",
        )}
      >
        {loadingFiles || !flatTree ? (
          <Skeleton />
        ) : !loadingFiles && (!r2Objects || r2Objects.length === 0) ? (
          <EmptyDrive />
        ) : (
          <ErrorBoundary>
            <TreeView
              data={flatTree}
              expandOnKeyboardSelect={false}
              aria-label="directory tree"
              className="w-full"
              defaultExpandedIds={expandedIds}
              clickAction="EXCLUSIVE_SELECT"
              multiSelect
              togglableSelect
              nodeRenderer={({
                element,
                isBranch,
                isExpanded,
                isSelected,
                handleExpand,
                handleSelect,
                getNodeProps,
                level,
                dispatch,
                treeState,
              }) => (
                <DriveTreeItem
                  isBranch={isBranch}
                  treeData={flatTree}
                  isSelected={isSelected}
                  isExpanded={isExpanded}
                  level={level}
                  handleExpand={handleExpand}
                  handleSelect={handleSelect}
                  element={element}
                  getNodeProps={getNodeProps}
                  dispatch={dispatch}
                  treeState={treeState}
                />
              )}
            />
          </ErrorBoundary>
        )}
      </div>
    </div>
  );
}
