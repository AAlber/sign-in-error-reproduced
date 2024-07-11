import { ArrowRight, CornerDownLeft } from "lucide-react";
import { type Dispatch, memo, useCallback, useMemo } from "react";
import type { INode, TreeViewAction } from "react-accessible-treeview";
import { useTranslation } from "react-i18next";
import {
  useDrive,
  useDynamicDrive,
} from "@/src/client-functions/client-cloudflare/hooks";
import {
  ContextMenuItem,
  ContextMenuSeparator,
} from "../../reusable/shadcn-ui/context-menu";
import { DeleteDirectoryItem } from "./delete-directory-item";
import { RenameDirectoryItem } from "./rename-directory-item";

export const FolderContextItems = memo(function FolderContextItems({
  element,
  dispatch,
}: {
  element: INode<any>;
  dispatch: Dispatch<TreeViewAction>;
}) {
  const { setOpenedFolderId } = useDynamicDrive();
  const drive = useDrive();
  const { t } = useTranslation("page");

  const hasWriteAccess = useMemo(
    () => drive.client.get.hasWriteAccess(),
    [drive, element],
  );
  const createDummySubdirectoryAndExpand = useCallback(() => {
    const parentId = element.id as string;
    drive.client.create.dummySubdirectory(parentId);
    drive.utils.expandElement(parentId, dispatch);
  }, [drive, element]);
  return (
    <>
      <ContextMenuSeparator className="bg-border" />
      {hasWriteAccess && (
        <ContextMenuItem onClick={createDummySubdirectoryAndExpand}>
          <CornerDownLeft
            aria-hidden="true"
            className="mr-1 h-4 w-4 text-contrast"
          />
          {t("new_subfolder")}
        </ContextMenuItem>
      )}
      {/* <ContextMenuItem className="flex justify-between ">
        {t("download")}
        <Download
          aria-hidden="true"
          size={18}
          className="text-muted-contrast"
        />
      </ContextMenuItem> */}
      <ContextMenuItem
        onClick={() => {
          setOpenedFolderId(element.id as string);
          drive.client.update.deepestFolderId(element.id as string);
        }}
      >
        <ArrowRight aria-hidden="true" className="mr-1 h-4 w-4 text-contrast" />
        {t("general.open")}
      </ContextMenuItem>
      <RenameDirectoryItem element={element} />
      {drive.client.get.hasWriteAccess() && (
        <ContextMenuSeparator className="bg-border" />
      )}
      <DeleteDirectoryItem element={element} />
    </>
  );
});
