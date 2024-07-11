import {
  type Dispatch,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
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
import { useDebounce } from "@/src/client-functions/client-utils/hooks";

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
  children: React.ReactNode;
}

//TODO: Fix translation for folder and file type
const DriveItemDndWrapper = memo(function DriveItemDndWrapper(
  props: DriveTreeItemProps,
) {
  const {
    setCurrentlyDragging,
    setFolderBeingDraggedOver,
    setIdsBeingDraggedOver,
    idsBeingDraggedOver,
    setIsDriveBeingDraggedOver,
  } = useDynamicDrive();
  const { element } = props;
  const drive = useDrive();
  const currentDirectory = useMemo(
    () => drive.client.get.directory(element),
    [drive, element],
  );

  const [enabled, setEnabled] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragStart = useCallback(
    (e: any) => {
      e.stopPropagation();
      setCurrentlyDragging(element.id as string);
    },
    [setCurrentlyDragging, element.id],
  );

  const handleDragLeave = useCallback(
    (e: any) => {
      e.stopPropagation();
      setIsDragOver(false);
    },
    [setCurrentlyDragging, element.id],
  );

  const handleDragOver = useCallback(
    (e: any) => {
      e.stopPropagation();
      e.preventDefault();
      setIsDragOver(true);
    },
    [setCurrentlyDragging, element.id],
  );
  const handleDragEnd = useCallback(
    (e: any) => {
      e.stopPropagation();
      setCurrentlyDragging("");
    },
    [setCurrentlyDragging, element.id],
  );
  useDebounce(
    () => {
      if (isDragOver) {
        if (currentDirectory?.type === "folder") {
          drive.utils.expandElement(element.id as string, props.dispatch);
        }
      }
    },
    [isDragOver],
    500,
  );
  const isRootFolderFile = useMemo(
    () => element.parent === 0 && currentDirectory?.type !== "folder",
    [currentDirectory, element.parent],
  );

  useEffect(() => {
    if (!isDragOver) {
      const finalIdsBeingDraggedOver = [
        ...idsBeingDraggedOver.filter((id) => id !== (element.id as string)),
      ];
      setIdsBeingDraggedOver(finalIdsBeingDraggedOver);
      if (finalIdsBeingDraggedOver.length === 0) {
        setFolderBeingDraggedOver("");
      }
      return;
    }
    if (isRootFolderFile) {
      setIsDriveBeingDraggedOver(true);
    }
    setIdsBeingDraggedOver([...idsBeingDraggedOver, element.id as string]);
    if (currentDirectory?.type !== "folder") {
      if (element.parent === 0) {
        setFolderBeingDraggedOver("");
      } else {
        setFolderBeingDraggedOver(element.parent as string);
      }
    } else {
      setFolderBeingDraggedOver(element.id as string);
    }
  }, [isDragOver]);

  useEffect(() => {
    const animation = requestAnimationFrame(() => setEnabled(true));
    return () => {
      cancelAnimationFrame(animation);
      setEnabled(false);
    };
  }, []);

  if (!enabled) {
    return null;
  }

  return (element?.name === "EmptyGq5GaeYoyabHtCGf.txt" &&
    !(element.id as string).includes("-new-folder")) ||
    !currentDirectory ? (
    <></>
  ) : (
    <div
      onDragOver={handleDragOver}
      draggable={drive.client.get.hasWriteAccess()}
      onDragLeave={handleDragLeave}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDrop={async (e) => {
        setIsDragOver(false);
        drive.client.handle.dropInSubfolder({
          e,
          setIsCurrentElementBeingDraggedOver: setIsDragOver,
        });
      }}
      className="focus:!border-transparent"
    >
      {props.children}
    </div>
  );
});
export default DriveItemDndWrapper;
