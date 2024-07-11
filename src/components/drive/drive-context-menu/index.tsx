import React, { memo, useMemo } from "react";
import { useDrive } from "@/src/client-functions/client-cloudflare/hooks";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuLabel,
  ContextMenuTrigger,
} from "../../reusable/shadcn-ui/context-menu";
import type { DriveTreeItemProps } from "../drive-tree-item/drive-item-dnd-wrapper";
import FileContextItems from "./file-context-items";
import { FolderContextItems } from "./folder-context-items";

//TODO: Fix translation for folder and file type
const DriveContextMenu = memo(function DriveContextMenu({
  element,
  children,
  treeState,
  handleExpand,
  handleSelect,
  dispatch,
}: Pick<
  DriveTreeItemProps,
  "dispatch" | "handleExpand" | "handleSelect" | "treeState" | "element"
> & {
  children: React.ReactNode;
}) {
  const drive = useDrive();
  const currentDirectory = useMemo(
    () => drive.client.get.directory(element),
    [drive, element],
  );
  return (
    <ContextMenu>
      <ContextMenuTrigger
        onContextMenu={(event) => {
          if (event.ctrlKey) {
            event.preventDefault();
            handleExpand(event);
            handleSelect(event);
          }
        }}
        onClick={(event) => {
          if (event.metaKey) {
            const finalSelectedIds = Array.from(treeState.selectedIds).filter(
              (id) => id !== element.id,
            );
            dispatch({
              type: "SELECT_MANY",
              ids: Array.from(finalSelectedIds),
              multiSelect: true,
              select: true,
            });
          }
        }}
      >
        {children}
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuGroup onClick={(e) => e.stopPropagation()}>
          <ContextMenuLabel>
            {element.name}
            <div className="flex items-center justify-between gap-6 text-xs font-normal text-muted-contrast">
              <p>{currentDirectory?.typeText} </p>
              <p>{currentDirectory?.sizeText} </p>
              <p>{currentDirectory?.lastModifiedText} </p>
            </div>
          </ContextMenuLabel>
          {currentDirectory?.type === "folder" ? (
            <FolderContextItems element={element} dispatch={dispatch} />
          ) : (
            <FileContextItems element={element} />
          )}
        </ContextMenuGroup>
      </ContextMenuContent>
    </ContextMenu>
  );
});
export default DriveContextMenu;
