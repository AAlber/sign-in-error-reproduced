import { Pen } from "lucide-react";
import { useMemo } from "react";
import type { INode } from "react-accessible-treeview";
import { useTranslation } from "react-i18next";
import {
  useDrive,
  useDynamicDrive,
} from "@/src/client-functions/client-cloudflare/hooks";
import { ContextMenuItem } from "../../reusable/shadcn-ui/context-menu";

export function RenameDirectoryItem({ element }: { element: INode<any> }) {
  const { setIdBeingRenamed } = useDynamicDrive();
  const drive = useDrive();
  const { t } = useTranslation("page");
  const hasWriteAccess = useMemo(
    () => drive.client.get.hasWriteAccess(),
    [drive, element],
  );
  return !hasWriteAccess ? (
    <></>
  ) : (
    <>
      <ContextMenuItem
        onClick={() => {
          setIdBeingRenamed(element.id as string);
        }}
      >
        <Pen aria-hidden="true" className="mr-1 h-4 w-4 text-contrast" />
        {t("general.rename")}
      </ContextMenuItem>
    </>
  );
}
