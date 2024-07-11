import { Download, Eye } from "lucide-react";
import { memo, useMemo } from "react";
import type { INode } from "react-accessible-treeview";
import { useTranslation } from "react-i18next";
import { useDrive } from "@/src/client-functions/client-cloudflare/hooks";
import { downloadFileFromUrl } from "@/src/client-functions/client-utils";
import { supportedFileTypesForFileViewer } from "@/src/utils/utils";
import {
  ContextMenuItem,
  ContextMenuSeparator,
} from "../../reusable/shadcn-ui/context-menu";
import { DeleteDirectoryItem } from "./delete-directory-item";
import { RenameDirectoryItem } from "./rename-directory-item";

const FileContextItems = memo(function FileContextItems({
  element,
}: {
  element: INode<any>;
}) {
  const drive = useDrive();
  const { t } = useTranslation("page");
  const currentDirectory = useMemo(
    () => drive.client.get.directory(element),
    [drive, element],
  );
  const supportedInViewer = useMemo(
    () =>
      supportedFileTypesForFileViewer.includes(
        currentDirectory?.type as string,
      ),
    [currentDirectory],
  );

  const hasWriteAccess = useMemo(
    () => drive.client.get.hasWriteAccess(),
    [drive, element],
  );
  return (
    <>
      <ContextMenuSeparator className="bg-border" />
      <ContextMenuItem
        onClick={async () => {
          await downloadFileFromUrl(
            element.name,
            process.env.NEXT_PUBLIC_WORKER_URL + "/" + element.id,
            false,
          );
        }}
      >
        <Download aria-hidden="true" className="mr-1 h-4 w-4 text-contrast" />
        {t("download")}
      </ContextMenuItem>
      {supportedInViewer && (
        <ContextMenuItem
          onClick={async () =>
            await downloadFileFromUrl(
              element.name,
              process.env.NEXT_PUBLIC_WORKER_URL + "/" + element.id,
              true,
            )
          }
        >
          <Eye aria-hidden="true" className="mr-1 h-4 w-4 text-contrast" />
          {t("general.view")}
        </ContextMenuItem>
      )}
      <RenameDirectoryItem element={element} />
      {hasWriteAccess && <ContextMenuSeparator className="bg-border" />}
      <DeleteDirectoryItem element={element} />
    </>
  );
});

export default FileContextItems;
