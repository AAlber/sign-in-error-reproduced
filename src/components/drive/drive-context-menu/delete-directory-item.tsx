import { Trash } from "lucide-react";
import { useCallback, useMemo } from "react";
import type { INode } from "react-accessible-treeview";
import { useTranslation } from "react-i18next";
import { useDrive } from "@/src/client-functions/client-cloudflare/hooks";
import { ContextMenuItem } from "../../reusable/shadcn-ui/context-menu";

export function DeleteDirectoryItem({ element }: { element: INode<any> }) {
  const drive = useDrive();
  const { t } = useTranslation("page");
  const hasWriteAccess = useMemo(
    () => drive.client.get.hasWriteAccess(),
    [drive, element],
  );
  const deleteDirectory = useCallback(() => {
    drive.client.confirm.deleteDirectory(t, element);
  }, [drive, element]);
  return !hasWriteAccess ? (
    <></>
  ) : (
    <>
      <ContextMenuItem className="text-destructive" onClick={deleteDirectory}>
        <Trash aria-hidden="true" className="mr-1 h-4 w-4" />
        {t("general.delete")}
      </ContextMenuItem>
    </>
  );
}
